import db from '../repositories/database';
import { ApprovalAction, ScoutStatus, UserRole } from '../types';

export const approvalService = {
  getPendingScoutsByRole: async (status: ScoutStatus) => {
    return db.findScoutsByStatus(status);
  },

  getApprovedScouts: async (filters: {
    role: UserRole;
    userId: number;
    startDate?: string;
    endDate?: string;
    company?: string;
    position?: string;
  }) => {
    const approved = await db.findScoutsByStatus('approved');

    return approved.filter((item: any) => {
      const byCompany = filters.company
        ? (item.company_name || '').toLowerCase().includes(filters.company.toLowerCase())
        : true;
      const byPosition = filters.position
        ? (item.position || '').toLowerCase().includes(filters.position.toLowerCase())
        : true;
      const submittedAt = item.submitted_at ? new Date(item.submitted_at).getTime() : 0;
      const byStartDate = filters.startDate ? submittedAt >= new Date(filters.startDate).getTime() : true;
      const byEndDate = filters.endDate ? submittedAt <= new Date(filters.endDate).getTime() : true;

      return byCompany && byPosition && byStartDate && byEndDate;
    });
  },

  approveScout: async (
    scoutId: number,
    approverId: number,
    approverRole: UserRole,
    comment?: string
  ) => {
    const scout = await db.findScoutById(scoutId);
    if (!scout) {
      return { success: false, message: 'スカウト文が見つかりません' };
    }

    const expectedStatus = approverRole === 'leader' ? 'pending_leader' : 'pending_admin';
    if (scout.status !== expectedStatus) {
      return { success: false, message: '現在のステータスでは承認できません' };
    }

    const nextStatus: ScoutStatus = approverRole === 'leader' ? 'pending_admin' : 'approved';
    const action: ApprovalAction = approverRole === 'leader' ? 'APPROVED_LEADER' : 'APPROVED_ADMIN';

    const updateResult = await db.updateScoutStatus(scoutId, nextStatus);
    if (!updateResult.success) {
      return { success: false, message: '承認処理に失敗しました' };
    }

    await db.createApprovalHistory(scoutId, approverId, action, comment);

    return {
      success: true,
      approvedAt: new Date().toISOString()
    };
  },

  rejectScout: async (
    scoutId: number,
    commenterId: number,
    commenterRole: UserRole,
    comment: string
  ) => {
    const scout = await db.findScoutById(scoutId);
    if (!scout) {
      return { success: false, message: 'スカウト文が見つかりません' };
    }

    const updateResult = await db.updateScoutStatus(scoutId, 'rejected');
    if (!updateResult.success) {
      return { success: false, message: '差戻し処理に失敗しました' };
    }

    const action: ApprovalAction = commenterRole === 'leader' ? 'REJECTED_LEADER' : 'REJECTED_ADMIN';

    await db.createApprovalHistory(scoutId, commenterId, action, comment);
    await db.createRejectionComment(scoutId, commenterId, comment);

    return {
      success: true,
      rejectedAt: new Date().toISOString()
    };
  },

  getScoutDetailWithHistory: async (scoutId: number) => {
    const detail = await db.findScoutDetailById(scoutId);
    if (!detail) {
      return null;
    }

    const approvalHistory = await db.findApprovalHistory(scoutId);
    const comments = await db.findRejectionComments(scoutId);

    return {
      ...detail,
      approvalHistory,
      comments
    };
  },

  getApprovalHistory: async (scoutId: number) => {
    return db.findApprovalHistory(scoutId);
  },

  getCommentsByScoutId: async (scoutId: number) => {
    return db.findRejectionComments(scoutId);
  },

  getApprovalStatistics: async (userId: number, role: UserRole) => {
    return db.getApprovalStatistics(userId, role);
  },

  bulkApprove: async (
    scoutIds: number[],
    approverId: number,
    approverRole: UserRole,
    comment?: string
  ) => {
    let successCount = 0;
    const failedIds: number[] = [];

    for (const scoutId of scoutIds) {
      const result = await approvalService.approveScout(scoutId, approverId, approverRole, comment);
      if (result.success) {
        successCount++;
      } else {
        failedIds.push(scoutId);
      }
    }

    return {
      successCount,
      failedCount: failedIds.length,
      failedIds
    };
  }
};