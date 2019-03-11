import messageData from '../data/messages';
import sentData from '../data/sent';
import inboxData from '../data/inbox';
import helper from '../helper/helper';
import userData from '../data/users';
import validateMessageInput from '../validation/message';

const messagefilePath = 'server/data/messages.json';
const sentfilePath = 'server/data/sent.json';
const inboxfilePath = 'server/data/inbox.json';

const {
  saveDataToFile,
  saveMessage,
  generateId,
  findUserByEmail,
  findSentMessagesById,
  findRecievedMessagesById,
  findMessageById,
  findMessageBySenderId,
  filterMessage,
} = helper;
class MessageController {
  /**
   *create a message
   * @param {*} req
   * @param {*} res
   */
  static createMessage(req, res) {
    const { body } = req;

    const { id } = req.user;

    // save as draft is status is draft
    if (body.status === 'draft') {
      body.id = generateId(messageData, 0);
      body.createdOn = new Date().toUTCString();
      body.parentMessageId = null;
      body.senderId = id;
      const message = saveDataToFile(messagefilePath, messageData, body);
      return res.status(201).json({
        status: 201,
        data: [
          {
            message,
          },
        ],
      });
    }
    // check if user pass valid and required data
    const { errors, isValid } = validateMessageInput(req.body);

    // check if user inputs are valid
    if (!isValid) {
      return res.status(400).json({
        status: 400,
        errors,
      });
    }
    try {
      const reciever = findUserByEmail(userData, body.reciever);

      // check if reciever is a valid user
      if (!reciever) {
        return res.status(404).json({
          status: 404,
          error: 'Reciever address was not recognized',
        });
      }
      // message
      const values = {
        id: generateId(messageData, 0),
        createdOn: new Date().toUTCString(),
        subject: body.subject,
        message: body.message,
        parentMessageId: generateId(messageData, 0),
        status: 'sent',
        senderId: id,
        recieverId: reciever.id,
      };
      // sent message
      const sent = {
        senderId: id,
        messageId: values.id,
        createdOn: values.createdOn,
      };
      // receive message
      const inbox = {
        recieverId: reciever.id,
        messageId: values.id,
        createdOn: values.createdOn,
      };

      const message = saveDataToFile(messagefilePath, messageData, values);
      // save sent message in sent
      saveDataToFile(sentfilePath, sentData, sent);

      // save recieved message in inbox
      saveDataToFile(inboxfilePath, inboxData, inbox);

      return res.status(201).json({
        status: 201,
        data: [
          {
            message,
          },
        ],
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: `${e} Sorry, something went wrong, try again`,
      });
    }
  }

  /**
   *Get recieved messages
   * @param {*} req
   * @param {*} res
   */
  static GetAllReceivedMessages(req, res) {
    const { id } = req.user;
    // get all recieved messages by status
    const recieved = findRecievedMessagesById(messageData, 'sent', id);

    // get all read messages by status
    const readRecieved = findRecievedMessagesById(messageData, 'read', id);

    // using spread operator to join sent and read array to form a new array
    const receivedMessages = [...recieved, ...readRecieved];

    // sort the messages by id in descending order
    const newReceivedMsg = receivedMessages.sort((a, b) => (a.id < b.id ? 1 : -1));

    return res.status(200).json({
      status: 200,
      data: newReceivedMsg,
    });
  }

  /**
   *Get unread messages
   * @param {*} req
   * @param {*} res
   */
  static GetAllUnreadReceivedMessages(req, res) {
    const { id } = req.user;
    // get all read messages by status
    const readRecieved = findRecievedMessagesById(messageData, 'sent', id);

    return res.status(200).json({
      status: 200,
      data: readRecieved,
    });
  }

  /**
   *Get all sent messages
   * @param {*} req
   * @param {*} res
   */
  static GetAllSentMessages(req, res) {
    const { id } = req.user;

    const sent = findSentMessagesById(messageData, 'sent', id);

    const read = findSentMessagesById(messageData, 'read', id);

    const sentMessages = [...read, ...sent];
    const msg = sentMessages.sort((a, b) => (a.id < b.id ? 1 : -1));

    return res.status(200).json({
      status: 200,
      data: msg,
    });
  }

  /**
   *Get a specific message
   * @param {*} req
   * @param {*} res
   */
  static GetSpecificMessage(req, res) {
    const { messageId } = req.params;
    const { id } = req.user;
    const idParams = parseInt(messageId, 10);
    const message = findMessageById(messageData, idParams, id);

    if (message.length === 0) {
      return res.status(400).json({
        status: 400,
        error: 'message does not exist',
      });
    }
    const updatedMessage = filterMessage(messageData, idParams);
    if (message[0].recieverId === id) {
      message.forEach((e) => {
        e.status = 'read';
      });
    }

    const newMessages = [...message, ...updatedMessage];
    const newMsg = newMessages.sort((a, b) => (a.id < b.id ? 1 : -1));
    saveMessage(messagefilePath, newMsg);

    return res.status(200).json({
      status: 200,
      data: message,
    });
  }

  /**
   * Delete a Specific message
   * @param {*} req
   * @param {*} res
   */
  static DeleteSpecificMessage(req, res) {
    const { messageId } = req.params;
    const { id } = req.user;
    const singleMessageId = parseInt(messageId, 10);
    const message = findMessageBySenderId(messageData, singleMessageId, id);
    if (message.length === 0) {
      return res.status(400).json({
        status: 400,
        error: 'cannot delete message',
      });
    }

    if (message[0].senderId !== id) {
      res.status(400).json({
        status: 400,
        error: 'can not delete message',
      });
    }

    const data = filterMessage(messageData, singleMessageId);

    saveMessage(messagefilePath, data);

    return res.status(200).json({
      status: 200,
      data: [
        {
          message: 'message deleted',
        },
      ],
    });
  }
}
// expose messageController
export default MessageController;
