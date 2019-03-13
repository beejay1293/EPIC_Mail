import express from 'express';
import userController from '../../controllers/userController';

const router = express.Router();

const { login, createAccountDb } = userController;

// db user signup route
router.post('/signup', createAccountDb);

router.post('/login', login);

// expose router
export default router;
