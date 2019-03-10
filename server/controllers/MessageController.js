import messageData from '../data/messages';
import sentData from '../data/sent';
import inboxData from '../data/inbox';
import helper from '../helper/helper';
import userData from '../data/users';
import validateMessageInput from '../validation/message';

const messagefilePath = 'server/data/messages.json';
const sentfilePath = 'server/data/sent.json';
const inboxfilePath = 'server/data/inbox.json';
class MessageController {
  /**
   *create a message
   * @param {*} req
   * @param {*} res
   */
  static createMessage(req, res) {
    const { body } = req;

    // save as draft is status is draft
    if (body.status === 'draft') {
      body.id = helper.generateId(messageData, 0);
      body.createdOn = new Date().toUTCString();
      body.parentMessageId = null;
      const message = helper.saveDataToFile(messagefilePath, messageData, body);
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
      const reciever = helper.findUserByEmail(userData, body.reciever);

      // check if reciever is a valid user
      if (!reciever) {
        return res.status(404).json({
          status: 404,
          error: 'Reciever address was not recognized',
        });
      }
      // message
      const values = {
        id: helper.generateId(messageData, 0),
        createdOn: new Date().toUTCString(),
        subject: body.subject,
        message: body.message,
        parentMessageId: helper.generateId(messageData, 0),
        status: 'sent',
        senderId: req.user.id,
        recieverId: reciever.id,
      };
      // sent message
      const sent = {
        senderId: req.user.id,
        messageId: values.id,
        createdOn: values.createdOn,
      };
      // receive message
      const inbox = {
        recieverId: reciever.id,
        messageId: values.id,
        createdOn: values.createdOn,
      };

      const message = helper.saveDataToFile(messagefilePath, messageData, values);
      // save sent message in sent
      helper.saveDataToFile(sentfilePath, sentData, sent);

      // save recieved message in inbox
      helper.saveDataToFile(inboxfilePath, inboxData, inbox);

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
    // get all sent messages by status
    const sent = helper.findMessage(messageData, 'sent');

    // get all read messages by status
    const read = helper.findMessage(messageData, 'read');

    // using spread operator to join sent and read array to form a new array
    const receivedMessages = [...sent, ...read];

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
    const sent = helper.findMessage(messageData, 'sent');

    return res.status(200).json({
      status: 200,
      data: sent,
    });
  }

  /**
   *Get all sent messages
   * @param {*} req
   * @param {*} res
   */
  static GetAllSentMessages(req, res) {
    const sent = helper.findMessage(messageData, 'sent');
    const read = helper.findMessage(messageData, 'read');

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
    const id = parseInt(messageId, 10);
    const message = helper.findMessageById(messageData, id);
    const updatedMessage = helper.filterMessage(messageData, id);
    message.forEach((e) => {
      e.status = 'read';
    });

    const newMessages = [...message, ...updatedMessage];
    const newMsg = newMessages.sort((a, b) => (a.id < b.id ? 1 : -1));
    helper.saveMessage(messagefilePath, newMsg);

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
    const id = parseInt(messageId, 10);
    const data = helper.filterMessage(messageData, id);

    const message = [...data];
    helper.saveMessage(messagefilePath, message);

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
