// import { Controller, Param, Patch } from '@nestjs/common';
// import { ScoutService } from '../services/scoutService';

// @Controller('api/approvals')
// export class ApprovalController {
//   constructor(private readonly scoutService: ScoutService) {}

//   @Patch(':id/approve')
//   approve(@Param('id') id: string) {
//     return this.scoutService.updateStatus(id, 'APPROVED');
//   }

//   @Patch(':id/remand')
//   remand(@Param('id') id: string) {
//     return this.scoutService.updateStatus(id, 'REMANDED');
//   }
// }





// backend/src/controllers/approvalController.ts

import { Request, Response, NextFunction } from 'express';
import { approvalService } from '../services/approvalService';

/**
 * 承認待ち一覧取得（営業リーダー用）
 * GET /api/approvals/pending-leader
 */
export const getPendingForLeader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentRole = (req as any).user.currentRole;

    // 権限チェック
    if (currentRole !== 'leader') {
      return res.status(403).json({
        success: false,
        message: '営業リーダー権限が必要です'
      });
    }

    // status='pending_leader'のスカウト文を取得
    const pendingScouts = await approvalService.getPendingScoutsByRole('pending_leader');

    res.status(200).json({
      success: true,
      data: {
        scouts: pendingScouts,
        count: pendingScouts.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 承認待ち一覧取得（管理者用）
 * GET /api/approvals/pending-admin
 */
export const getPendingForAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentRole = (req as any).user.currentRole;

    // 権限チェック
    if (currentRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '管理者権限が必要です'
      });
    }

    // status='pending_admin'のスカウト文を取得
    const pendingScouts = await approvalService.getPendingScoutsByRole('pending_admin');

    res.status(200).json({
      success: true,
      data: {
        scouts: pendingScouts,
        count: pendingScouts.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 承認済み一覧取得（営業リーダー・管理者共通）
 * GET /api/approvals/approved
 */
export const getApprovedList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentRole = (req as any).user.currentRole;
    const userId = (req as any).user.userId;

    // 権限チェック
    if (currentRole !== 'leader' && currentRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '承認者権限が必要です'
      });
    }

    // クエリパラメータ（絞り込み条件）
    const { startDate, endDate, company, position } = req.query;

    const approvedScouts = await approvalService.getApprovedScouts({
      role: currentRole,
      userId: userId,
      startDate: startDate as string,
      endDate: endDate as string,
      company: company as string,
      position: position as string
    });

    res.status(200).json({
      success: true,
      data: {
        scouts: approvedScouts,
        count: approvedScouts.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * スカウト文承認（営業リーダー）
 * POST /api/approvals/:id/approve-leader
 */
export const approveByLeader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scoutId = parseInt(req.params.id);
    const userId = (req as any).user.userId;
    const currentRole = (req as any).user.currentRole;
    const { comment } = req.body; // 承認コメント（任意）

    // 権限チェック
    if (currentRole !== 'leader') {
      return res.status(403).json({
        success: false,
        message: '営業リーダー権限が必要です'
      });
    }

    // 承認処理（status: pending_leader → pending_admin）
    const result = await approvalService.approveScout(scoutId, userId, 'leader', comment);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || '承認処理に失敗しました'
      });
    }

    res.status(200).json({
      success: true,
      message: '承認しました。管理者の承認待ちになります',
      data: {
        scoutId: scoutId,
        newStatus: 'pending_admin',
        approvedAt: result.approvedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * スカウト文承認（管理者）
 * POST /api/approvals/:id/approve-admin
 */
export const approveByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scoutId = parseInt(req.params.id);
    const userId = (req as any).user.userId;
    const currentRole = (req as any).user.currentRole;
    const { comment } = req.body; // 承認コメント（任意）

    // 権限チェック
    if (currentRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '管理者権限が必要です'
      });
    }

    // 承認処理（status: pending_admin → approved）
    const result = await approvalService.approveScout(scoutId, userId, 'admin', comment);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || '承認処理に失敗しました'
      });
    }

    res.status(200).json({
      success: true,
      message: '最終承認が完了しました',
      data: {
        scoutId: scoutId,
        newStatus: 'approved',
        approvedAt: result.approvedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * スカウト文差戻し（営業リーダー・管理者共通）
 * POST /api/approvals/:id/reject
 */
export const rejectScout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scoutId = parseInt(req.params.id);
    const userId = (req as any).user.userId;
    const currentRole = (req as any).user.currentRole;
    const { comment } = req.body; // 差戻し理由（必須）

    // 権限チェック
    if (currentRole !== 'leader' && currentRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '承認者権限が必要です'
      });
    }

    // バリデーション
    if (!comment || comment.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '差戻し理由は必須です'
      });
    }

    // 差戻し処理（status → rejected）
    const result = await approvalService.rejectScout(scoutId, userId, currentRole, comment);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || '差戻し処理に失敗しました'
      });
    }

    res.status(200).json({
      success: true,
      message: '差戻しました',
      data: {
        scoutId: scoutId,
        newStatus: 'rejected',
        rejectedAt: result.rejectedAt,
        rejectedBy: currentRole
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * スカウト文詳細取得（承認者用）
 * GET /api/approvals/:id/detail
 */
export const getScoutDetailForApproval = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scoutId = parseInt(req.params.id);
    const currentRole = (req as any).user.currentRole;

    // 権限チェック
    if (currentRole !== 'leader' && currentRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '承認者権限が必要です'
      });
    }

    // スカウト文詳細 + 承認履歴 + コメント履歴を取得
    const scoutDetail = await approvalService.getScoutDetailWithHistory(scoutId);

    if (!scoutDetail) {
      return res.status(404).json({
        success: false,
        message: 'スカウト文が見つかりません'
      });
    }

    res.status(200).json({
      success: true,
      data: scoutDetail
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 承認履歴取得
 * GET /api/approvals/:id/history
 */
export const getApprovalHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scoutId = parseInt(req.params.id);

    const history = await approvalService.getApprovalHistory(scoutId);

    res.status(200).json({
      success: true,
      data: {
        history: history
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * コメント一覧取得
 * GET /api/approvals/:id/comments
 */
export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scoutId = parseInt(req.params.id);

    const comments = await approvalService.getCommentsByScoutId(scoutId);

    res.status(200).json({
      success: true,
      data: {
        comments: comments
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 承認統計情報取得（ダッシュボード用）
 * GET /api/approvals/statistics
 */
export const getApprovalStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentRole = (req as any).user.currentRole;
    const userId = (req as any).user.userId;

    // 権限チェック
    if (currentRole !== 'leader' && currentRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '承認者権限が必要です'
      });
    }

    const statistics = await approvalService.getApprovalStatistics(userId, currentRole);

    res.status(200).json({
      success: true,
      data: statistics
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 一括承認（複数のスカウト文を同時に承認）
 * POST /api/approvals/bulk-approve
 */
export const bulkApprove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.userId;
    const currentRole = (req as any).user.currentRole;
    const { scoutIds, comment } = req.body; // scoutIds: number[]

    // 権限チェック
    if (currentRole !== 'leader' && currentRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '承認者権限が必要です'
      });
    }

    // バリデーション
    if (!scoutIds || !Array.isArray(scoutIds) || scoutIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: '承認対象のスカウト文IDが必要です'
      });
    }

    const result = await approvalService.bulkApprove(scoutIds, userId, currentRole, comment);

    res.status(200).json({
      success: true,
      message: `${result.successCount}件承認しました`,
      data: {
        successCount: result.successCount,
        failedCount: result.failedCount,
        failedIds: result.failedIds
      }
    });
  } catch (error) {
    next(error);
  }
};