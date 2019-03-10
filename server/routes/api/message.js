import express from 'express';
import MessageController from '../../controllers/MessageController';
import isAuth from '../../middleswares/is-Auth';

const router = express.Router();

// post a message route
router.post('/messages', isAuth.verifyToken, MessageController.createMessage);

// get all received messages route
router.get('/messages', isAuth.verifyToken, MessageController.GetAllReceivedMessages);

// get all unread messages endpoint
router.get('/messages/unread', isAuth.verifyToken, MessageController.GetAllUnreadReceivedMessages);

// get all sent messages endpoint
router.get('/messages/sent', isAuth.verifyToken, MessageController.GetAllSentMessages);

// get specific messages endpoint
router.get('/messages/:messageId', isAuth.verifyToken, MessageController.GetSpecificMessage);

// delete specific messages endpoint
router.delete('/messages/:messageId', isAuth.verifyToken, MessageController.DeleteSpecificMessage);

// expose router
export default router;
