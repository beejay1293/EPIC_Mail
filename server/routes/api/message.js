import express from 'express';
import MessageController from '../../controllers/MessageController';

const router = express.Router();

// post a message route
router.post('/messages', MessageController.createMessage);

// get all received messages route
router.get('/messages', MessageController.GetAllReceivedMessages);

// get all unread messages enpoint
router.get('/messages/unread', MessageController.GetAllUnreadReceivedMessages);

// get all sent messages endpoint
router.get('/messages/sent', MessageController.GetAllSentMessages);

// get specific messages endpoint
router.get('/messages/:messageId', MessageController.GetSpecificMessage);

// delete specific messages endpoint
router.delete('/messages/:messageId', MessageController.DeleteSpecificMessage);

// expose router
export default router;
