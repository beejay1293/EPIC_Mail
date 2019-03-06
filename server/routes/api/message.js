import express from 'express';
import MessageController from '../../controllers/MessageController';

const router = express.Router();

// create a message route
router.post('/messages', MessageController.createMessage);

// get all received messages route
router.get('/messages', MessageController.GetAllReceivedMessages);

// expose router
export default router;
