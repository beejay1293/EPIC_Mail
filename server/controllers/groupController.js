import DB from '../db/index';

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
    const { rows } = await DB.query(queryString, [body.groupname, id]);

    return res.status(200).json({
      status: 'success',
      data: [rows[0]],
    });
  }

  /**
   * get all groups
   * @param {*} req
   * @param {*} res
   */
  static async GetAllGroups(req, res) {
    const { id } = req.user;
    const queryString = 'SELECT * FROM groups WHERE (createdby) = ($1)';
    const { rows } = await DB.query(queryString, [id]);

    return res.status(200).json({
      status: 'success',
      data: rows,
    });
  }
}

export default GroupController;
