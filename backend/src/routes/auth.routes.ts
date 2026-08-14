import { Router } from 'express';
import { signup, login, setupInitialAdmin } from '../controllers/auth.controller';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/setup-admin', setupInitialAdmin);

export default router;
