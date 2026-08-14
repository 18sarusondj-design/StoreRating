import { Router } from 'express';
import { createStoreWithOwner, getStores, submitRating, getStoreOwnerDashboard } from '../controllers/store.controller';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

// Admin routes
router.post('/', authorizeRoles('ADMIN'), createStoreWithOwner);

// Normal User routes
router.post('/:storeId/rating', authorizeRoles('NORMAL'), submitRating);

// Store Owner routes
router.get('/owner-dashboard', authorizeRoles('STORE_OWNER'), getStoreOwnerDashboard);

// Accessible by Admin and Normal User
router.get('/', authorizeRoles('ADMIN', 'NORMAL'), getStores);

export default router;
