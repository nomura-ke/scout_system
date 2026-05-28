import db from '../repositories/database';
import { ScoutStatus, UserRole } from '../types';

export const scoutService = {
  getScoutsByUser: async (
    userId: number,
    role: UserRole,
    filters?: { status?: string; company?: string; position?: string }
  ) => {
    if (role === 'creator') {
      return db.findScoutsByCreator(userId, {
        status: filters?.status as ScoutStatus | undefined,
        company: filters?.company,
        position: filters?.position
      });
    }

    if (filters?.status) {
      return db.findScoutsByStatus(filters.status as ScoutStatus);
    }

    const pendingLeader = await db.findScoutsByStatus('pending_leader');
    const pendingAdmin = await db.findScoutsByStatus('pending_admin');
    const approved = await db.findScoutsByStatus('approved');
    return [...pendingLeader, ...pendingAdmin, ...approved];
  },

  getScoutDetail: async (scoutId: number, userId: number) => {
    const detail = await db.findScoutDetailById(scoutId);
    if (!detail) {
      return null;
    }

    if (detail.scout.creator_id !== userId) {
      const userRoles = await db.findUserRoles(userId);
      const canReview = userRoles.some((role) => role.role === 'leader' || role.role === 'admin');
      if (!canReview) {
        return null;
      }
    }

    return detail;
  },

  createScoutFromGeneration: async (
    userId: number,
    draftData: any,
    aiRequest: any,
    generatedText: string
  ) => {
    const title = `${draftData?.company_name || '企業'} ${draftData?.position || 'ポジション'} スカウト`;
    const prompt = JSON.stringify({ draftData, aiRequest });

    const documentId = await db.createScoutWithTransaction(
      userId,
      title,
      generatedText,
      draftData,
      {
        ...aiRequest,
        prompt
      }
    );

    const detail = await db.findScoutDetailById(documentId);

    return {
      id: documentId,
      content: generatedText,
      draftDetails: detail?.draft || draftData
    };
  },

  updateScout: async (
    scoutId: number,
    userId: number,
    content: string,
    draftData?: any
  ) => {
    const existing = await db.findScoutById(scoutId);
    if (!existing || existing.creator_id !== userId) {
      return { success: false };
    }

    await db.updateScout(scoutId, content, draftData);
    const scout = await db.findScoutDetailById(scoutId);

    return { success: true, scout };
  },

  deleteScout: async (scoutId: number, userId: number) => {
    const existing = await db.findScoutById(scoutId);
    if (!existing || existing.creator_id !== userId) {
      return { success: false };
    }

    const result = await db.deleteScout(scoutId);
    return { success: result.success };
  },

  submitForApproval: async (scoutId: number, userId: number) => {
    const existing = await db.findScoutById(scoutId);
    if (!existing || existing.creator_id !== userId) {
      return { success: false, message: '対象データが見つからないか権限がありません' };
    }

    if (existing.status !== 'draft' && existing.status !== 'rejected') {
      return { success: false, message: 'このステータスでは承認申請できません' };
    }

    const updateResult = await db.updateScoutStatus(scoutId, 'pending_leader');
    if (!updateResult.success) {
      return { success: false, message: '承認申請に失敗しました' };
    }

    await db.createApprovalHistory(scoutId, userId, 'SUBMITTED');

    return {
      success: true,
      newStatus: 'pending_leader'
    };
  },

  saveDraft: async (userId: number, content: string, draftData: any) => {
    const title = `${draftData?.company_name || '企業'} ${draftData?.position || 'ポジション'} 下書き`;
    const documentId = await db.createScoutWithTransaction(
      userId,
      title,
      content || '',
      draftData || {},
      {
        age_range: '',
        gender: '指定なし',
        salary: draftData?.salary || '',
        position: draftData?.position || '',
        ng_words: '',
        prompt: 'manual_draft'
      }
    );

    return { id: documentId };
  }
};