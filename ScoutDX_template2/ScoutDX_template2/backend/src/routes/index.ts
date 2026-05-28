import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as scoutController from '../controllers/scoutController';
import * as approvalController from '../controllers/approvalController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// ===============================================
// 認証関連ルート
// ===============================================
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.post('/auth/logout', authenticate, authController.logout);
router.get('/auth/roles', authenticate, authController.getUserRoles);
router.put('/auth/role', authenticate, authController.updateCurrentRole);
router.get('/auth/verify', authenticate, authController.verifySession);

// ===============================================
// スカウト文関連ルート
// ===============================================
router.get('/scouts', authenticate, scoutController.getScoutList);
router.get('/scouts/:id', authenticate, scoutController.getScoutDetail);
router.post('/scouts/generate', authenticate, authorize('creator', 'leader', 'admin'), scoutController.generateScout);
router.put('/scouts/:id', authenticate, authorize('creator', 'leader', 'admin'), scoutController.updateScout);
router.delete('/scouts/:id', authenticate, authorize('creator', 'leader', 'admin'), scoutController.deleteScout);
router.post('/scouts/:id/submit', authenticate, authorize('creator', 'leader', 'admin'), scoutController.submitForApproval);
router.post('/scouts/draft', authenticate, authorize('creator', 'leader', 'admin'), scoutController.saveDraft);

// ===============================================
// 承認関連ルート
// ===============================================
router.get('/approvals/pending-leader', authenticate, authorize('leader'), approvalController.getPendingForLeader);
router.get('/approvals/pending-admin', authenticate, authorize('admin'), approvalController.getPendingForAdmin);
router.get('/approvals/approved', authenticate, authorize('leader', 'admin'), approvalController.getApprovedList);
router.get('/approvals/statistics', authenticate, authorize('leader', 'admin'), approvalController.getApprovalStatistics);
router.post('/approvals/bulk-approve', authenticate, authorize('leader', 'admin'), approvalController.bulkApprove);
router.get('/approvals/:id/detail', authenticate, authorize('leader', 'admin'), approvalController.getScoutDetailForApproval);
router.get('/approvals/:id/history', authenticate, authorize('leader', 'admin'), approvalController.getApprovalHistory);
router.get('/approvals/:id/comments', authenticate, authorize('leader', 'admin'), approvalController.getComments);
router.post('/approvals/:id/approve-leader', authenticate, authorize('leader'), approvalController.approveByLeader);
router.post('/approvals/:id/approve-admin', authenticate, authorize('admin'), approvalController.approveByAdmin);
router.post('/approvals/:id/reject', authenticate, authorize('leader', 'admin'), approvalController.rejectScout);

export default router;