import { Router } from 'express';
import * as userCtrl from '../../controllers/user/user.controller';
import { verifyAdminToken } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/login', userCtrl.loginAdmin);
router.get('/user-info', verifyAdminToken, userCtrl.getUserInfo);


export default router;