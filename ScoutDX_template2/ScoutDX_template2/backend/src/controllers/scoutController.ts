// import { Body, Controller, Get, Post } from '@nestjs/common';
// import { AiService } from '../services/aiService';
// import { ScoutService } from '../services/scoutService';
// import { ScoutEntity } from '../types';

// @Controller('api/scouts')
// export class ScoutController {
//   constructor(
//     private readonly scoutService: ScoutService,
//     private readonly aiService: AiService,
//   ) {}

//   @Get()
//   findAll() {
//     return this.scoutService.findAll();
//   }

//   @Post()
//   create(@Body() body: ScoutEntity) {
//     return this.scoutService.create(body);
//   }

//   @Get('generate')
//   generate() {
//     return this.aiService.getSample();
//   }
// }





// backend/src/controllers/scoutController.ts

import { Request, Response, NextFunction } from 'express';
import { scoutService } from '../services/scoutService';
import { aiService } from '../services/aiService';

/**
 * スカウト文一覧取得（作成者用）
 * GET /api/scouts
 */
export const getScoutList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const currentRole = (req as any).user.currentRole;

    // クエリパラメータ（絞り込み条件）
    const { status, company, position } = req.query;

    const scouts = await scoutService.getScoutsByUser(userId, currentRole, {
      status: status as string,
      company: company as string,
      position: position as string
    });

    res.status(200).json({
      success: true,
      data: {
        scouts: scouts
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * スカウト文詳細取得
 * GET /api/scouts/:id
 */
export const getScoutDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const scoutId = parseInt(req.params.id);
    const userId = (req as any).user.userId;

    const scout = await scoutService.getScoutDetail(scoutId, userId);

    if (!scout) {
      return res.status(404).json({
        success: false,
        message: 'スカウト文が見つかりません'
      });
    }

    res.status(200).json({
      success: true,
      data: scout
    });
  } catch (error) {
    next(error);
  }
};

/**
 * スカウト文作成（AI生成）
 * POST /api/scouts/generate
 */
export const generateScout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { draftData, aiRequest } = req.body;

    // バリデーション
    if (!draftData || !aiRequest) {
      return res.status(400).json({
        success: false,
        message: '必須項目が不足しています'
      });
    }

    // AI生成処理
    const generatedText = await aiService.generateScoutText(draftData, aiRequest);

    // NGワードチェック
    const ngCheckResult = aiService.checkNGWords(generatedText, aiRequest.ngWords);
    if (!ngCheckResult.passed) {
      return res.status(400).json({
        success: false,
        message: 'NGワードが含まれています',
        data: {
          ngWords: ngCheckResult.detectedWords
        }
      });
    }

    // スカウト文保存
    const scout = await scoutService.createScoutFromGeneration(
      userId,
      draftData,
      aiRequest,
      generatedText
    );

    res.status(201).json({
      success: true,
      message: 'スカウト文を生成しました',
      data: {
        scoutId: scout.id,
        content: scout.content,
        draftDetails: scout.draftDetails
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * スカウト文更新（編集）
 * PUT /api/scouts/:id
 */
export const updateScout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const scoutId = parseInt(req.params.id);
    const userId = (req as any).user.userId;
    const { content, draftData } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'スカウト文の内容は必須です'
      });
    }

    const result = await scoutService.updateScout(scoutId, userId, content, draftData);

    if (!result.success) {
      return res.status(403).json({
        success: false,
        message: '編集権限がありません'
      });
    }

    res.status(200).json({
      success: true,
      message: '保存しました',
      data: result.scout
    });
  } catch (error) {
    next(error);
  }
};

/**
 * スカウト文削除
 * DELETE /api/scouts/:id
 */
export const deleteScout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const scoutId = parseInt(req.params.id);
    const userId = (req as any).user.userId;

    const result = await scoutService.deleteScout(scoutId, userId);

    if (!result.success) {
      return res.status(403).json({
        success: false,
        message: '削除権限がありません'
      });
    }

    res.status(200).json({
      success: true,
      message: '削除しました'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 承認申請（営業リーダーへ）
 * POST /api/scouts/:id/submit
 */
export const submitForApproval = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const scoutId = parseInt(req.params.id);
    const userId = (req as any).user.userId;

    const result = await scoutService.submitForApproval(scoutId, userId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || '承認申請できません'
      });
    }

    res.status(200).json({
      success: true,
      message: '承認申請しました',
      data: {
        status: result.newStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 下書き一時保存
 * POST /api/scouts/draft
 */
export const saveDraft = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { content, draftData } = req.body;

    const draft = await scoutService.saveDraft(userId, content, draftData);

    res.status(201).json({
      success: true,
      message: '下書きを保存しました',
      data: {
        draftId: draft.id
      }
    });
  } catch (error) {
    next(error);
  }
};