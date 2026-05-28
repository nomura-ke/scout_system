import { Router } from 'express';
import { authController } from '../controllers/authController';
import { scoutController } from '../controllers/scoutController';
import { approvalController } from '../controllers/approvalController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// ===============================================
// 認証関連ルート
// ===============================================
router.post('/api/auth/login', authController.login);
router.post('/api/auth/logout', authenticate, authController.logout);
router.get('/api/auth/roles', authenticate, authController.getRoles);
router.post('/api/auth/role/select', authenticate, authController.selectRole);

// ===============================================
// スカウト文関連ルート
// ===============================================
router.get('/api/scout', authenticate, scoutController.getScouts);
router.get('/api/scout/:id', authenticate, scoutController.getScoutById);
router.post('/api/scout/create', authenticate, requireRole('CREATOR', 'LEADER', 'ADMIN'), scoutController.createScout);
router.put('/api/scout/:id', authenticate, requireRole('CREATOR', 'LEADER', 'ADMIN'), scoutController.updateScout);
router.delete('/api/scout/:id', authenticate, requireRole('CREATOR', 'LEADER', 'ADMIN'), scoutController.deleteScout);
router.post('/api/scout/:id/submit', authenticate, requireRole('CREATOR', 'LEADER', 'ADMIN'), scoutController.submitScout);

// ===============================================
// 承認関連ルート
// ===============================================
router.get('/api/approval/pending', authenticate, requireRole('LEADER', 'ADMIN'), approvalController.getPending);
router.get('/api/approval/approved', authenticate, requireRole('LEADER', 'ADMIN'), approvalController.getApproved);
router.post('/api/approval/:id/approve', authenticate, requireRole('LEADER', 'ADMIN'), approvalController.approve);
router.post('/api/approval/:id/reject', authenticate, requireRole('LEADER', 'ADMIN'), approvalController.reject);

export default router;