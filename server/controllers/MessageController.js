import dotenv from 'dotenv';
import messageData from '../data/messages';
import sentData from '../data/sent';
import inboxData from '../data/inbox';
import helper from '../helper/helper';
import userData from '../data/users';
import validateMessageInput from '../validation/message';
import Db from '../db/index';

dotenv.config();

const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const client = require('twilio')(accountSid, authToken);

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
        data: {
          message,
        },
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
        data: {
          message,
        },
      });
    } catch (e) {
      return res.status(500).json({
        status: 500,
        error: 'Sorry, something went wrong, try again',
      });
    }
  }

  static async createMessagedb(req, res) {
    const { body } = req;

    const { id, email } = req.user;

    try {
      // save as draft is status is draft

      if (body.status === 'draft') {
        const values = [body.subject, body.message, body.parentmessageid, body.status, id, email];
        const queryString = 'INSERT INTO messages(subject, message, parentmessageid, status, createdby, sender) VALUES($1, $2, $3, $4, $5, $6) returning *';
        const { rows } = await Db.query(queryString, values);

        return res.status(201).json({
          status: 201,
          data: {
            rows,
          },
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
        await Db.query('BEGIN');

        const queryString = 'SELECT * FROM users WHERE email = $1';
        const receiver = await Db.query(queryString, [body.reciever]);

        // check if user exist in database
        if (!receiver.rows[0]) {
          return res.status(404).json({
            status: 404,
            error: 'Reciever not a valid user',
          });
        }
        console.log(receiver.rows[0].id);

        const messagevalues = [
          body.subject,
          body.message,
          'sent',
          id,
          body.parentmessageid,
          email,
          body.reciever,
          receiver.rows[0].id,
        ];

        const saveMessagequeryString = 'INSERT INTO messages(subject, message, status, createdby, parentmessageid, sender, receiver, receivedby) VALUES($1, $2, $3, $4, $5, $6, $7, $8) returning *';
        const { rows } = await Db.query(saveMessagequeryString, messagevalues);
        // sent message

        const sentqueryString = 'INSERT INTO sent(senderid, messageid) VALUES($1, $2) returning *';
        const sent = [id, rows[0].id];
        await Db.query(sentqueryString, sent);

        // received Message
        const inboxQueryString = 'INSERT INTO inbox(receiverid, messageid) VALUES($1, $2) returning *';
        const inbox = [receiver.rows[0].id, rows[0].id];
        await Db.query(inboxQueryString, inbox);

        await Db.query('COMMIT');

        // response
        const msg = rows[0];

        // deliever messages with twilio
        client.messages.create({
          to: process.env.TO,
          from: process.env.FROM,
          body: `${email} SENT "${msg.message}" TO ${receiver.rows[0].email}`,
        });
        return res.status(201).json({
          status: 201,
          data: {
            msg,
          },
        });
      } catch (error) {
        await Db.query('ROLLBACK');
        return res.status(500).json({
          status: 500,
          error: 'something went wrong',
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'Internal server error',
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

  static async GetAllReceivedMessagesdb(req, res) {
    const { id } = req.user;

    const queryString = 'SELECT messages.id, messages.sender, messages.createdon, messages.subject, messages.message, messages.parentmessageid, messages.status FROM messages LEFT JOIN inbox ON messages.id = inbox.messageid WHERE inbox.receiverid = $1';
    const { rows } = await Db.query(queryString, [id]);

    return res.status(200).json({
      status: 200,
      data: rows,
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
   * get all unread messages from db
   * @param {*} req
   * @param {*} res
   */
  static async GetAllUnreadReceivedMessagesdb(req, res) {
    const { id } = req.user;

    console.log(id);

    // get all read messages by status
    const queryString = 'SELECT messages.id, messages.sender, messages.createdon, messages.subject, messages.message, messages.parentmessageid, messages.status FROM messages LEFT JOIN inbox ON messages.id = inbox.messageid WHERE (inbox.receiverid, messages.status) = ($1, $2)';
    const { rows } = await Db.query(queryString, [id, 'sent']);

    return res.status(200).json({
      status: 200,
      data: rows,
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
   *Get all sent messages from db
   * @param {*} req
   * @param {*} res
   */
  static async GetAllSentMessagesdb(req, res) {
    const { id } = req.user;

    const queryString = 'SELECT messages.id, messages.receiver, messages.createdon, messages.subject, messages.message, messages.parentmessageid, messages.status FROM messages LEFT JOIN sent ON messages.id = sent.messageid WHERE sent.senderid = $1';
    const { rows } = await Db.query(queryString, [id]);

    return res.status(200).json({
      status: 200,
      data: rows,
    });
  }

  static async GetAllDraftMessages(req, res) {
    console.log('draft');

    const { id } = req.user;
    const queryString = 'SELECT * FROM messages WHERE (status,createdBy) = ($1, $2)';

    const { rows } = await Db.query(queryString, ['draft', id]);

    return res.status(200).json({
      status: 200,
      data: rows,
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
   *Get a specific message db
   * @param {*} req
   * @param {*} res
   */
  static async GetSpecificMessagedb(req, res) {
    const { messageId } = req.params;
    const { id, firstname, lastname } = req.user;
    const idParams = parseInt(messageId, 10);

    try {
      const draftquery = 'SELECT * FROM messages WHERE (status, createdby, id) = ($1, $2, $3)';

      const draftmessage = await Db.query(draftquery, ['draft', id, idParams]);

      if (draftmessage.rows[0]) {
        return res.status(200).json({
          status: 200,
          data: draftmessage.rows[0],
        });
      }
      const queryString = 'SELECT messages.id, messages.createdon, messages.subject, messages.message, messages.parentmessageid, messages.status, messages.sender, messages.receiver, messages.createdby, messages.receivedby FROM messages LEFT JOIN inbox ON messages.id = inbox.messageid LEFT JOIN sent ON messages.id = sent.messageid WHERE messages.id = $1';
      const { rows } = await Db.query(queryString, [idParams]);

      const query = 'SELECT firstname,lastname FROM users WHERE id = $1';
      const messageReceiver = await Db.query(query, [rows[0].receivedby]);
      console.log(rows[0]);

      if (rows[0].createdby === id) {
        return res.status(200).json({
          status: 200,
          data: rows[0],
          sender: { firstname, lastname },
          receiver: messageReceiver.rows[0],
        });
      }

      if (rows[0].receivedby === id) {
        const queryStrings = 'UPDATE messages SET STATUS = $1 WHERE ID = $2 returning *';
        await Db.query(queryStrings, ['read', rows[0].id]);

        const senderQuery = 'SELECT firstname,lastname FROM users WHERE id = $1';
        const messageSender = await Db.query(senderQuery, [rows[0].createdby]);

        return res.status(200).json({
          status: 200,
          data: rows[0],
          sender: messageSender.rows[0],
          receiver: { firstname, lastname },
        });
      }
      return res.status(404).json({
        status: 404,
        error: 'message does not exist',
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'message cannot be found',
      });
    }
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
      data: {
        message: 'message deleted',
      },
    });
  }

  /**
   * Delete a Specific message from db
   * @param {*} req
   * @param {*} res
   */
  static async DeleteSpecificMessagedb(req, res) {
    const { messageId } = req.params;
    const { id } = req.user;
    const singleMessageId = parseInt(messageId, 10);

    try {
      // delete from sent table
      const deletesent = 'DELETE FROM sent WHERE (senderid, messageid) = ($1, $2) returning *';
      const deletedsentmessage = await Db.query(deletesent, [id, singleMessageId]);

      if (deletedsentmessage.rows[0]) {
        // check message status
        const messageQuery = 'SELECT * FROM messages WHERE id = $1';
        const { rows } = await Db.query(messageQuery, [singleMessageId]);

        if (rows[0].status === 'sent') {
          try {
            await Db.query('BEGIN');
            // delete from inbox table
            const deleteinbox = 'DELETE FROM inbox WHERE messageid = $1 returning *';
            await Db.query(deleteinbox, [singleMessageId]);

            // delete from message table
            const deleteMessage = 'DELETE FROM messages WHERE (createdby, id) = ($1, $2) returning *';
            await Db.query(deleteMessage, [id, singleMessageId]);
            await Db.query('COMMIT');

            return res.status(200).json({
              status: 200,
              data: `message with id of ${deletedsentmessage.rows[0].messageid} has been deleted`,
            });
          } catch (error) {
            await Db.query('ROLLBACK');
            return res.status(500).json({
              status: 500,
              error: 'internal server error',
            });
          }
        }

        return res.status(200).json({
          status: 200,
          data: `message with id of ${deletedsentmessage.rows[0].messageid} has been deleted`,
        });
      }

      const deleteinbox = 'DELETE FROM inbox WHERE (receiverid, messageid) = ($1, $2) returning *';
      const deletedinbox = await Db.query(deleteinbox, [id, singleMessageId]);

      if (deletedinbox.rows[0]) {
        res.status(200).json({
          status: 200,
          data: `message with id of ${deletedinbox.rows[0].messageid} has been deleted`,
        });
      }

      return res.status(400).json({
        status: 400,
        error: 'sorry, you are unable to delete this message',
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }
}
// expose messageController
export default MessageController;
