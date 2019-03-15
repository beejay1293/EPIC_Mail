import DB from '../db/index';

class GroupController {
  static async createGroup(req, res) {
    const { id } = req.user;
    const { body } = req;

    const queryString = 'INSERT INTO groups(name, admin) VALUES($1, $2) returning *';
    const { rows } = await DB.query(queryString, [body.groupname, id]);

    return res.status(200).json({
      status: 200,
      data: rows[0],
    });
  }
}

export default GroupController;
