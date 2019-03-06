import express from 'express';
import MessageController from '../../controllers/MessageController';

const router = express.Router();

// create a message route
router.post('/messages', MessageController.createMessage);

// get all received messages route
router.get('/messages', MessageController.GetAllReceivedMessages);

// get all unread messages enpoint
router.get('/messages/unread', MessageController.GetAllUnreadReceivedMessages);

// get all sent messages endpoint
router.get('/messages/sent', MessageController.GetAllSentMessages);

// expose router
export default router;
