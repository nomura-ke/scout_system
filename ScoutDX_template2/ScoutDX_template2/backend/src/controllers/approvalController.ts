import { Request, Response, NextFunction } from 'express';
import { approvalService } from '../services/approvalService';

export const getPendingForLeader = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pendingScouts = await approvalService.getPendingScoutsByRole('pending_leader');
    return res.status(200).json({
      success: true,
      data: {
        scouts: pendingScouts,
        count: pendingScouts.length
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const getPendingForAdmin = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pendingScouts = await approvalService.getPendingScoutsByRole('pending_admin');
    return res.status(200).json({
      success: true,
      data: {
        scouts: pendingScouts,
        count: pendingScouts.length
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const getApprovedList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const approvedScouts = await approvalService.getApprovedScouts({
      role: req.user!.currentRole,
      userId: req.user!.userId,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      company: req.query.company as string,
      position: req.query.position as string
    });

    return res.status(200).json({
      success: true,
      data: {
        scouts: approvedScouts,
        count: approvedScouts.length
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const approveByLeader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scoutId = Number(req.params.id);
    const result = await approvalService.approveScout(
      scoutId,
      req.user!.userId,
      'leader',
      req.body.comment
    );

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      message: '承認しました。管理者の承認待ちになります',
      data: {
        scoutId,
        newStatus: 'pending_admin',
        approvedAt: result.approvedAt
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const approveByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scoutId = Number(req.params.id);
    const result = await approvalService.approveScout(
      scoutId,
      req.user!.userId,
      'admin',
      req.body.comment
    );

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      message: '最終承認が完了しました',
      data: {
        scoutId,
        newStatus: 'approved',
        approvedAt: result.approvedAt
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const rejectScout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scoutId = Number(req.params.id);
    const comment = req.body.comment;

    if (!comment || String(comment).trim() === '') {
      return res.status(400).json({ success: false, message: '差戻し理由は必須です' });
    }

    const result = await approvalService.rejectScout(
      scoutId,
      req.user!.userId,
      req.user!.currentRole,
      comment
    );

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      message: '差戻しました',
      data: {
        scoutId,
        newStatus: 'rejected',
        rejectedAt: result.rejectedAt,
        rejectedBy: req.user!.currentRole
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const getScoutDetailForApproval = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scoutDetail = await approvalService.getScoutDetailWithHistory(Number(req.params.id));
    if (!scoutDetail) {
      return res.status(404).json({ success: false, message: 'スカウト文が見つかりません' });
    }

    return res.status(200).json({ success: true, data: scoutDetail });
  } catch (error) {
    return next(error);
  }
};

export const getApprovalHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const history = await approvalService.getApprovalHistory(Number(req.params.id));
    return res.status(200).json({ success: true, data: { history } });
  } catch (error) {
    return next(error);
  }
};

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comments = await approvalService.getCommentsByScoutId(Number(req.params.id));
    return res.status(200).json({ success: true, data: { comments } });
  } catch (error) {
    return next(error);
  }
};

export const getApprovalStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const statistics = await approvalService.getApprovalStatistics(
      req.user!.userId,
      req.user!.currentRole
    );
    return res.status(200).json({ success: true, data: statistics });
  } catch (error) {
    return next(error);
  }
};

export const bulkApprove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { scoutIds, comment } = req.body;

    if (!Array.isArray(scoutIds) || scoutIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: '承認対象のスカウト文IDが必要です'
      });
    }

    const result = await approvalService.bulkApprove(
      scoutIds,
      req.user!.userId,
      req.user!.currentRole,
      comment
    );

    return res.status(200).json({
      success: true,
      message: `${result.successCount}件承認しました`,
      data: result
    });
  } catch (error) {
    return next(error);
  }
};
