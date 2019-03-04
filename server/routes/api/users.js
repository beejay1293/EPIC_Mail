import express from 'express';
import userController from '../../controllers/userController';

const router = express.Router();

// user signup route
router.post('/signup', userController.createAccount);

router.post('/login', userController.login);

// expose router
export default router;
