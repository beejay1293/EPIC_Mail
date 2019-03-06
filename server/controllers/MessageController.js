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
   *
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
      const sender = helper.findUserByEmail(userData, body.sender);

      if (!reciever) {
        return res.status(404).json({
          status: 404,
          error: 'Reciever address was not recognized',
        });
      }

      const values = {
        id: helper.generateId(messageData, 0),
        createdOn: new Date().toUTCString(),
        subject: body.subject,
        message: body.message,
        parentMessageId: helper.generateId(messageData, 0),
        status: 'sent',
        senderId: sender.id,
        recieverId: reciever.id,
      };
      // sent message
      const sent = {
        senderId: sender.id,
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

      helper.saveDataToFile(sentfilePath, sentData, sent);
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
   *
   * @param {*} req
   * @param {*} res
   */
  static GetAllReceivedMessages(req, res) {
    const sent = helper.findMessage(messageData, 'sent');
    // const draft = helper.findMessage(messageData, 'draft');
    const read = helper.findMessage(messageData, 'read');

    // sent.forEach((e) => {
    //   e.status = 'read';
    // });
    const receivedMessages = [...sent, ...read];
    // const msg = [...sent, ...draft, ...read];
    // helper.saveMessage(messagefilePath, msg);

    return res.status(200).json({
      status: 200,
      data: receivedMessages,
    });
  }

  /**
   *
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
   *
   * @param {*} req
   * @param {*} res
   */
  static GetAllSentMessages(req, res) {
    const sent = helper.findMessage(messageData, 'sent');
    const read = helper.findMessage(messageData, 'read');

    const sentMessages = [...sent, ...read];

    return res.status(200).json({
      status: 200,
      data: sentMessages,
    });
  }

  /**
   *
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
    helper.saveMessage(messagefilePath, newMessages);

    return res.status(200).json({
      status: 200,
      data: message,
    });
  }
}

export default MessageController;
