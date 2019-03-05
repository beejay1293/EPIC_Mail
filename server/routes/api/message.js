import express from 'express';
import MessageController from '../../controllers/MessageController';

const router = express.Router();

// create a message route
router.post('/messages', MessageController.createMessage);

// expose router
export default router;
