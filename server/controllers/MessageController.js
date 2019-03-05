import messageData from '../data/messages';
import sentData from '../data/sent';
import inboxData from '../data/inbox';
import helper from '../helper/helper';
import userData from '../data/users';
import validateMessageInput from '../validation/message';

class MessageController {
  static createMessage(req, res) {
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
      const { body } = req;

      const values = {
        id: helper.generateId(messageData, 0),
        createdOn: new Date().toUTCString(),
        subject: body.subject,
        message: body.message,
        parentMessageId: helper.generateId(messageData, 0),
        status: body.status,
      };

      const reciever = helper.findUserByEmail(userData, body.reciever);
      const sender = helper.findUserByEmail(userData, body.sender);

      if (!reciever) {
        return res.status(404).json({
          status: 404,
          error: 'Reciever address was not recognized',
        });
      }

      const sent = {
        senderId: sender.id,
        messageId: values.id,
        createdOn: values.createdOn,
      };

      const inbox = {
        recieverId: reciever.id,
        messageId: values.id,
        createdOn: values.createdOn,
      };

      const messagefilePath = 'server/data/messages.json';
      const sentfilePath = 'server/data/sent.json';
      const inboxfilePath = 'server/data/inbox.json';

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
}

export default MessageController;
