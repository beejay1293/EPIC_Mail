import express from 'express';
import MessageController from '../../controllers/MessageController';
import isAuth from '../../middleswares/is-Auth';

const { verifyToken } = isAuth;
const {
  createMessage,
  GetAllReceivedMessages,
  GetAllUnreadReceivedMessages,
  GetAllSentMessages,
  GetSpecificMessage,
  DeleteSpecificMessage,
} = MessageController;

const router = express.Router();

// post a message route
router.post('/messages', verifyToken, createMessage);

// get all received messages route
router.get('/messages', verifyToken, GetAllReceivedMessages);

// get all unread messages endpoint
router.get('/messages/unread', verifyToken, GetAllUnreadReceivedMessages);

// get all sent messages endpoint
router.get('/messages/sent', verifyToken, GetAllSentMessages);

// get specific messages endpoint
router.get('/messages/:messageId', verifyToken, GetSpecificMessage);

// delete specific messages endpoint
router.delete('/messages/:messageId', verifyToken, DeleteSpecificMessage);

// expose router
export default router;
