import express from 'express';
import userController from '../../controllers/userController';

const router = express.Router();

// user signup route
router.post('/signup', userController.createAccount);

// expose router
export default router;
