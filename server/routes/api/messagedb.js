import express from 'express';
import MessageController from '../../controllers/MessageController';
import isAuth from '../../middleswares/is-Auth';

const { verifyTokendb } = isAuth;
const {
  createMessagedb,
  GetAllReceivedMessagesdb,
  GetAllUnreadReceivedMessagesdb,
  GetAllSentMessagesdb,
  GetSpecificMessagedb,
  DeleteSpecificMessagedb,
  GetAllDraftMessages,
} = MessageController;

const router = express.Router();

// post a message route
router.post('/messages', verifyTokendb, createMessagedb);

// get all received messages route
router.get('/messages', verifyTokendb, GetAllReceivedMessagesdb);

// get all unread messages endpoint
router.get('/messages/unread', verifyTokendb, GetAllUnreadReceivedMessagesdb);

// get all sent messages endpoint
router.get('/messages/sent', verifyTokendb, GetAllSentMessagesdb);

// get all draft messages endpoint
router.get('/messages/draft', verifyTokendb, GetAllDraftMessages);

// get specific messages endpoint
router.get('/messages/:messageId', verifyTokendb, GetSpecificMessagedb);

// delete specific messages endpoint
router.delete('/messages/:messageId', verifyTokendb, DeleteSpecificMessagedb);

// expose router
export default router;
