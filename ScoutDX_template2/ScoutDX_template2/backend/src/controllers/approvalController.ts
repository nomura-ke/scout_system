import { Request, Response } from 'express';
import { approvalService } from '../services/approvalService';
import { ApprovalRequest } from '../types';

export const approvalController = {
  /**
   * GET /api/approval/pending
   * 承認待ち一覧取得
   */
  getPending: async (req: Request, res: Response): Promise<void> => {
    try {
      const currentRole = req.currentRole!;

      // LEADERのみアクセス可能
      if (currentRole !== 'LEADER' && currentRole !== 'ADMIN') {
        res.status(403).json({ success: false, message: 'アクセス権限がありません' });
        return;
      }

      const scouts = await approvalService.getPendingScouts();

      res.status(200).json({
        success: true,
        data: scouts,
      });
    } catch (error) {
      console.error('Get pending scouts error:', error);
      res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
    }
  },

  /**
   * GET /api/approval/approved
   * 承認済み一覧取得
   */
  getApproved: async (req: Request, res: Response): Promise<void> => {
    try {
      const currentRole = req.currentRole!;

      // LEADERのみア��セス可能
      if (currentRole !== 'LEADER' && currentRole !== 'ADMIN') {
        res.status(403).json({ success: false, message: 'アクセス権限がありません' });
        return;
      }

      const scouts = await approvalService.getApprovedScouts();

      res.status(200).json({
        success: true,
        data: scouts,
      });
    } catch (error) {
      console.error('Get approved scouts error:', error);
      res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
    }
  },

  /**
   * POST /api/approval/:id/approve
   * 承認
   */
  approve: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.userId!;
      const currentRole = req.currentRole!;

      if (isNaN(id)) {
        res.status(400).json({ success: false, message: '無効なIDです' });
        return;
      }

      // LEADERのみ承認可能
      if (currentRole !== 'LEADER' && currentRole !== 'ADMIN') {
        res.status(403).json({ success: false, message: '承認権限がありません' });
        return;
      }

      const scout = await approvalService.approveScout(id, userId);

      res.status(200).json({
        success: true,
        data: scout,
        message: 'スカウト文を承認しました',
      });
    } catch (error) {
      console.error('Approve scout error:', error);
      res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
    }
  },

  /**
   * POST /api/approval/:id/reject
   * 差戻し
   */
  reject: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.userId!;
      const currentRole = req.currentRole!;
      const { comment } = req.body as ApprovalRequest;

      if (isNaN(id)) {
        res.status(400).json({ success: false, message: '無効なIDです' });
        return;
      }

      // LEADERのみ差戻し可能
      if (currentRole !== 'LEADER' && currentRole !== 'ADMIN') {
        res.status(403).json({ success: false, message: '差戻し権限がありません' });
        return;
      }

      if (!comment || comment.trim() === '') {
        res.status(400).json({ success: false, message: '差戻し理由は必須です' });
        return;
      }

      const scout = await approvalService.rejectScout(id, userId, comment);

      res.status(200).json({
        success: true,
        data: scout,
        message: 'スカウト文を差戻しました',
      });
    } catch (error) {
      console.error('Reject scout error:', error);
      res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
    }
  },
};