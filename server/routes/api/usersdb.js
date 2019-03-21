import express from 'express';
import userController from '../../controllers/userController';
import Auth from '../../middleswares/is-Auth';

const { trimmer } = Auth;

const router = express.Router();

const { loginDb, createAccountDb } = userController;

// db user signup route
router.post('/signup', trimmer, createAccountDb);

router.post('/login', loginDb);

// expose router
export default router;
