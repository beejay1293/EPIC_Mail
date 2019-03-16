import DB from '../db/index';

const { query } = DB;

class GroupController {
  /**
   * create a new group
   * @param {*} req
   * @param {*} res
   */
  static async createGroup(req, res) {
    const { id } = req.user;
    const { body } = req;

    const queryString = 'INSERT INTO groups(name, createdby) VALUES($1, $2) returning *';
    const { rows } = await query(queryString, [body.groupname, id]);

    const queryString2 = 'INSERT INTO groups_members(groupId, memberId, role) VALUES($1, $2, $3) returning *';
    const groupmember = await query(queryString2, [rows[0].id, id, 'admin']);
    const response = [
      { id: groupmember.rows[0].groupid, name: rows[0].name, role: groupmember.rows[0].role },
    ];
    return res.status(200).json({
      status: 'success',
      data: response,
    });
  }

  /**
   * get all groups
   * @param {*} req
   * @param {*} res
   */
  static async GetAllGroups(req, res) {
    const { id } = req.user;
    const queryString = 'SELECT groups.id, groups.name, groups_members.role FROM groups LEFT JOIN groups_members ON groups_members.groupid = groups.id WHERE (groups_members.memberid) = ($1)';
    const { rows } = await query(queryString, [id]);

    return res.status(200).json({
      status: 'success',
      data: rows,
    });
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
  }
}

export default GroupController;
