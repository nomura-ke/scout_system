import { db } from '../repositories/database';
import { ScoutDocument } from '../types';

export const approvalService = {
  /**
   * 承認待ち一覧取得
   */
  getPendingScouts: async (): Promise<ScoutDocument[]> => {
    return await db.findScoutsByStatus('PENDING');
  },

  /**
   * 承認済み一覧取得
   */
  getApprovedScouts: async (): Promise<ScoutDocument[]> => {
    return await db.findScoutsByStatus('APPROVED');
  },

  /**
   * 承認
   */
  approveScout: async (scoutId: number, approverId: number): Promise<ScoutDocument> => {
    return await db.updateScout(scoutId, {
      status: 'APPROVED',
      approved_at: new Date(),
      approved_by: approverId,
    });
  },

  /**
   * 差戻し
   */
  rejectScout: async (
    scoutId: number,
    commenterId: number,
    comment: string
  ): Promise<ScoutDocument> => {
    // コメント追加
    await db.createComment(scoutId, commenterId, comment);

    // ステータスを差戻しに変更
    return await db.updateScout(scoutId, {
      status: 'REJECTED',
    });
  },
};