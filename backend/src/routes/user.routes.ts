import { Router } from 'express';
import { createUser, getUsers, updatePassword, getDashboardStats } from '../controllers/user.controller';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

// Admin only routes
router.post('/', authorizeRoles('ADMIN'), createUser);
router.get('/', authorizeRoles('ADMIN'), getUsers);
router.get('/dashboard-stats', authorizeRoles('ADMIN'), getDashboardStats);

// All authenticated users can update password
router.put('/password', updatePassword);

export default router;
