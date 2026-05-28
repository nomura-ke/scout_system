import { db } from '../repositories/database';
import { ScoutDocument, CreateScoutRequest, UpdateScoutRequest } from '../types';
import { aiService } from './aiService';

export const scoutService = {
  /**
   * スカウト文一覧取得
   */
  getScouts: async (userId: number, role: string, status?: string): Promise<ScoutDocument[]> => {
    if (role === 'CREATOR') {
      return await db.findScoutsByCreatorId(userId, status);
    } else if (role === 'LEADER') {
      if (status) {
        return await db.findScoutsByStatus(status);
      }
      // LEADERは全てのステータスを取得可能
      const pending = await db.findScoutsByStatus('PENDING');
      const approved = await db.findScoutsByStatus('APPROVED');
      return [...pending, ...approved];
    }
    return [];
  },

  /**
   * スカウト文詳細取得
   */
  getScoutById: async (id: number): Promise<ScoutDocument | null> => {
    return await db.findScoutById(id);
  },

  /**
   * スカウト文作成（AI生成含む）
   */
  createScout: async (userId: number, data: CreateScoutRequest): Promise<ScoutDocument> => {
    // AIでスカウト文生成
    const scoutText = aiService.generateScoutText(data);

    const scoutData: Partial<ScoutDocument> = {
      creator_id: userId,
      applicant_name: data.applicant_name,
      applicant_age: data.applicant_age,
      applicant_gender: data.applicant_gender,
      company_name: data.company_name,
      job_title: data.job_title,
      job_description: data.job_description,
      required_skills: data.required_skills,
      location: data.location,
      salary: data.salary,
      job_appeal: data.job_appeal,
      ng_words: data.ng_words,
      scout_text: scoutText,
      status: 'DRAFT',
    };

    return await db.createScout(scoutData);
  },

  /**
   * スカウト文更新
   */
  updateScout: async (id: number, data: UpdateScoutRequest): Promise<ScoutDocument> => {
    return await db.updateScout(id, data);
  },

  /**
   * スカウト文削除
   */
  deleteScout: async (id: number): Promise<void> => {
    await db.deleteScout(id);
  },

  /**
   * 承認申請
   */
  submitScout: async (id: number): Promise<ScoutDocument> => {
    return await db.updateScout(id, {
      status: 'PENDING',
      submitted_at: new Date(),
    });
  },

  /**
   * コメント取得
   */
  getComments: async (scoutId: number) => {
    return await db.findCommentsByScoutId(scoutId);
  },
};