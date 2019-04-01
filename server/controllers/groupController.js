import dotenv from 'dotenv';
import DB from '../db/index';

dotenv.config();

const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const client = require('twilio')(accountSid, authToken);

const { query } = DB;

class GroupController {
  /**
   * create a new group
   * @param {*} req
   * @param {*} res
   */
  static async createGroup(req, res) {
    try {
      const { id } = req.user;
      const { body } = req;

      if (body.groupname === '') {
        return res.status(400).json({
          status: 400,
          error: 'Group name cannot be empty',
        });
      }

      try {
        await query('BEGIN');
        const queryString = 'INSERT INTO groups(name, createdby) VALUES($1, $2) returning *';
        const { rows } = await query(queryString, [body.groupname, id]);

        const queryString2 = 'INSERT INTO groups_members(groupId, memberId, role) VALUES($1, $2, $3) returning *';
        const groupmember = await query(queryString2, [rows[0].id, id, 'admin']);

        await query('COMMIT');

        const response = {
          id: groupmember.rows[0].groupid,
          name: rows[0].name,
          role: groupmember.rows[0].role,
        };

        return res.status(201).json({
          status: 201,
          data: response,
        });
      } catch (error) {
        await query('ROLLBACK');
        return res.status(500).json({
          status: 500,
          error: 'something went wrong',
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }

  /**
   * get all groups
   * @param {*} req
   * @param {*} res
   */
  static async GetAllGroups(req, res) {
    const { id } = req.user;

    try {
      const queryString = 'SELECT groups.id, groups.name, groups_members.role FROM groups LEFT JOIN groups_members ON groups_members.groupid = groups.id WHERE (groups_members.memberid) = ($1)';
      const { rows } = await query(queryString, [id]);

      return res.status(200).json({
        status: 'success',
        data: rows,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }

  /**
   * Edit name of a specific group
   * @param {*} req
   * @param {*} res
   */

  static async EditSpecificGroupName(req, res) {
    const { id } = req.user;
    const { groupId } = req.params;
    const { body } = req;
    const values = [body.groupname, groupId];

    try {
      const queryString2 = 'SELECT * FROM groups_members WHERE (groupid, memberid) = ($1, $2)';
      const members = await query(queryString2, [groupId, id]);

      if (members.rows[0].role === 'admin' || members.rows[0].role === 'moderator') {
        const queryString = 'UPDATE groups SET name = $1 WHERE (id) = ($2) returning *';
        const { rows } = await query(queryString, values);
        if (!rows[0]) {
          return res.status(404).json({
            status: 400,
            error: 'message can not be found',
          });
        }
        const response = [{ id: rows[0].id, name: rows[0].name, role: members.rows[0].role }];
        return res.status(200).json({
          status: 200,
          data: response,
        });
      }

      return res.status(400).json({
        status: 400,
        error: 'sorry, you can not edit group name',
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }

  /**
   * delete a specific  group
   * @param {*} req
   * @param {*} res
   */
  static async DeleteSpecificGroup(req, res) {
    const { id } = req.user;
    const { groupId } = req.params;

    const queryString = 'SELECT * FROM groups_members WHERE (groups_members.groupId, groups_members.memberId, role) = ($1, $2, $3)';
    const { rows } = await query(queryString, [groupId, id, 'admin']);

    // check if user is an admin
    if (!rows[0]) {
      return res.status(400).json({
        status: 400,
        error: 'sorry you can not delete group',
      });
    }
    try {
      await query('BEGIN');
      const querystr = 'DELETE FROM groups_members WHERE groups_members.groupId = $1';
      await query(querystr, [groupId]);

      const queryString2 = 'DELETE FROM groups WHERE groups.id = $1';
      await query(queryString2, [groupId]);
      await query('COMMIT');

      return res.status(200).json({
        status: 200,
        data: {
          message: 'group has been deleted',
        },
      });
    } catch (error) {
      await query('ROLLBACK');
      return res.status(500).json({
        status: 500,
        error: 'something went wrong',
      });
    }
  }

  /**
   * Add user to group
   * @param {*} req
   * @param {*} res
   */

  static async AddUserToGroup(req, res) {
    const { id } = req.user;
    const { groupId } = req.params;
    const { body } = req;

    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index += 1) {
        // eslint-disable-next-line no-await-in-loop
        await callback(array[index], index, array);
      }
    }

    try {
      const queryString = 'SELECT * FROM groups_members WHERE (groups_members.groupId, groups_members.memberId) = ($1, $2)';
      const { rows } = await query(queryString, [groupId, id]);

      // check if user is an admin or moderator in group
      if (rows.length === 0 || rows[0].role === 'user') {
        return res.status(403).json({
          status: 403,
          error: 'sorry, you can not add a user to this group',
        });
      }

      if (typeof body.email !== 'string' && body.email.length > 0) {
        await asyncForEach(body.email, async (user) => {
          const userQuery = 'SELECT * FROM users WHERE email = $1';
          const newUser = await query(userQuery, [user]);

          const addUserQuery = 'INSERT INTO groups_members(groupId, memberId, role) VALUES($1, $2, $3)';
          await query(addUserQuery, [groupId, newUser.rows[0].id, 'user']);
        });

        const responseQuery = 'SELECT * FROM groups_members WHERE groupId = $1';
        const response = await query(responseQuery, [groupId]);

        return res.status(201).json({
          status: 201,
          data: response.rows,
        });
      }

      const userQuery = 'SELECT * FROM users WHERE email = $1';
      const user = await query(userQuery, [body.email]);

      // check if the user exists in our users db
      if (user.rows.length === 0) {
        return res.status(404).json({
          status: 404,
          error: 'user not found',
        });
      }

      const userExistQuery = 'SELECT * FROM groups_members WHERE (groupId, groups_members.memberId) = ($1, $2)';
      const userExist = await query(userExistQuery, [groupId, user.rows[0].id]);
      // check if user is already a member of the group
      if (userExist.rows.length > 0) {
        return res.status(409).json({
          status: 409,
          error: 'user already a group member',
        });
      }

      const queryString2 = 'INSERT INTO groups_members(groupId, memberId, role) VALUES($1, $2, $3)';
      await query(queryString2, [groupId, user.rows[0].id, 'user']);

      const responseQuery = 'SELECT * FROM groups_members WHERE groupId = $1';
      const response = await query(responseQuery, [groupId]);

      return res.status(201).json({
        status: 201,
        data: response.rows,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }

  /**
   * Delete User from group
   * @param {*} req
   * @param {*} res
   */
  static async DeleteUserFromGroup(req, res) {
    const { id } = req.user;
    const { groupId, userId } = req.params;
    try {
      const queryString = 'SELECT * FROM groups_members WHERE (groups_members.groupId, groups_members.memberId) = ($1, $2)';
      const { rows } = await query(queryString, [groupId, id]);

      // check if user is an admin or moderator in group
      if (rows.length === 0 || rows[0].role === 'user') {
        return res.status(403).json({
          status: 403,
          error: 'sorry, you can not delete a user from this group',
        });
      }

      const userExistQuery = 'SELECT * FROM groups_members WHERE (groupId, groups_members.memberId) = ($1, $2)';
      const userExist = await query(userExistQuery, [groupId, userId]);
      // check if user is member of the group
      if (userExist.rows.length === 0) {
        return res.status(409).json({
          status: 409,
          error: 'user not a group member',
        });
      }

      const queryString2 = 'DELETE FROM groups_members WHERE (groupId, memberId) = ($1, $2) ';
      await query(queryString2, [groupId, userId]);

      return res.status(201).json({
        status: 201,
        data: {
          message: 'user has been removed from group',
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }

  /**
   * Send an email to a group
   * @param {*} req
   * @param {*} res
   */
  static async SendEmailToGroup(req, res) {
    const { id, email } = req.user;
    const { groupId } = req.params;
    const { body } = req;
    try {
      const queryString = 'SELECT * FROM groups_members WHERE (groups_members.groupId, groups_members.memberId) = ($1, $2)';
      const { rows } = await query(queryString, [groupId, id]);

      // check if user belongs to group
      if (rows.length === 0) {
        return res.status(403).json({
          status: 403,
          error: 'sorry, you are not a member of this group',
        });
      }

      const values = [
        body.subject,
        body.message,
        'sent',
        id,
        body.parentmessageid,
        'true',
        groupId,
      ];
      const queryString2 = 'INSERT INTO messages(subject, message, status, createdby, parentmessageid, groupmessage, groupmessageid) VALUES($1, $2, $3, $4, $5, $6, $7) returning *';
      const message = await query(queryString2, values);

      // deliever messages with twilio
      client.messages.create({
        to: process.env.TO,
        from: process.env.FROM,
        body: `${email} SENT "${message.rows[0].message}" TO a group with ID of ${groupId}`,
      });

      return res.status(201).json({
        status: 201,
        data: message.rows[0],
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }
}

// Expose Group Controller
export default GroupController;
