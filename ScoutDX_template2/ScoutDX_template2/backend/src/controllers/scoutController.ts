import { Request, Response } from 'express';
import { scoutService } from '../services/scoutService';
import { CreateScoutRequest, UpdateScoutRequest } from '../types';

export const scoutController = {
  /**
   * GET /api/scout
   * スカウト文一覧取得
   */
  getScouts: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.userId!;
      const currentRole = req.currentRole!;
      const status = req.query.status as string | undefined;

      const scouts = await scoutService.getScouts(userId, currentRole, status);

      res.status(200).json({
        success: true,
        data: scouts,
      });
    } catch (error) {
      console.error('Get scouts error:', error);
      res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
    }
  },

  /**
   * GET /api/scout/:id
   * スカウト文詳細取得
   */
  getScoutById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ success: false, message: '無効なIDです' });
        return;
      }

      const scout = await scoutService.getScoutById(id);

      if (!scout) {
        res.status(404).json({ success: false, message: 'スカウト文が見つかりません' });
        return;
      }

      // コメントも取得
      const comments = await scoutService.getComments(id);

      res.status(200).json({
        success: true,
        data: {
          ...scout,
          comments,
        },
      });
    } catch (error) {
      console.error('Get scout by id error:', error);
      res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
    }
  },

  /**
   * POST /api/scout/create
   * スカウト文作成
   */
  createScout: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.userId!;
      const data = req.body as CreateScoutRequest;

      // バリデーション
      if (!data.applicant_name || !data.company_name || !data.job_title) {
        res.status(400).json({
          success: false,
          message: '求職者名、会社名、職種は必須です',
        });
        return;
      }

      const scout = await scoutService.createScout(userId, data);

      res.status(201).json({
        success: true,
        data: scout,
      });
    } catch (error) {
      console.error('Create scout error:', error);
      res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
    }
  },

  /**
   * PUT /api/scout/:id
   * スカウト文更新
   */
  updateScout: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body as UpdateScoutRequest;
      const userId = req.userId!;

      if (isNaN(id)) {
        res.status(400).json({ success: false, message: '無効なIDです' });
        return;
      }

      // 既存データ確認
      const existingScout = await scoutService.getScoutById(id);
      if (!existingScout) {
        res.status(404).json({ success: false, message: 'スカウト文が見つかりません' });
        return;
      }

      // 作成者本人のみ編集可能
      if (existingScout.creator_id !== userId) {
        res.status(403).json({ success: false, message: '編集権限がありません' });
        return;
      }

      const scout = await scoutService.updateScout(id, data);

      res.status(200).json({
        success: true,
        data: scout,
      });
    } catch (error) {
      console.error('Update scout error:', error);
      res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
    }
  },

  /**
   * DELETE /api/scout/:id
   * スカウト文削除
   */
  deleteScout: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.userId!;

      if (isNaN(id)) {
        res.status(400).json({ success: false, message: '無効なIDです' });
        return;
      }

      // 既存データ確認
      const existingScout = await scoutService.getScoutById(id);
      if (!existingScout) {
        res.status(404).json({ success: false, message: 'スカウト文が見つかりません' });
        return;
      }

      // 作成者本人のみ削除可能
      if (existingScout.creator_id !== userId) {
        res.status(403).json({ success: false, message: '削除権限がありません' });
        return;
      }

      await scoutService.deleteScout(id);

      res.status(200).json({
        success: true,
        message: 'スカウト文を削除しました',
      });
    } catch (error) {
      console.error('Delete scout error:', error);
      res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
    }
  },

  /**
   * POST /api/scout/:id/submit
   * 承認申請
   */
  submitScout: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.userId!;

      if (isNaN(id)) {
        res.status(400).json({ success: false, message: '無効なIDです' });
        return;
      }

      // 既存データ確認
      const existingScout = await scoutService.getScoutById(id);
      if (!existingScout) {
        res.status(404).json({ success: false, message: 'スカウト文が見つかりません' });
        return;
      }

      // 作成者本人のみ申請可能
      if (existingScout.creator_id !== userId) {
        res.status(403).json({ success: false, message: '申請権限がありません' });
        return;
      }

      // DRAFTまたはREJECTEDのみ申請可能
      if (existingScout.status !== 'DRAFT' && existingScout.status !== 'REJECTED') {
        res.status(400).json({
          success: false,
          message: '申請できるステータスではありません',
        });
        return;
      }

      const scout = await scoutService.submitScout(id);

      res.status(200).json({
        success: true,
        data: scout,
      });
    } catch (error) {
      console.error('Submit scout error:', error);
      res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
    }
  },
};