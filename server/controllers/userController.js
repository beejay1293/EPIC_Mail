import validateSignUpInput from '../validation/signup';
import userData from '../data/users';
import helper from '../helper/helper';

class UserController {
  /**
   * Create a user account
   *
   * @param {*} req
   * @param {*} res
   */

  static createAccount(req, res) {
    // check if user pass valid and required data
    const { errors, isValid } = validateSignUpInput(req.body);

    // check if user inputs are valid
    if (!isValid) {
      return res.status(400).json({
        status: 400,
        errors,
      });
    }

    try {
      // check if user already exists
      const emailExists = helper.findUseByEmail(userData, req.body.email);

      if (emailExists) {
        return res.status(409).json({
          status: 409,
          error: 'user already exists',
        });
      }

      const { body } = req;

      const values = {
        id: helper.generateId(userData, 0),
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        number: body.number,
        password: body.password,
      };

      const filePath = 'server/data/users.json';
      const savedData = helper.saveDataToFile(filePath, userData, values);

      return res.status(201).json({
        status: 201,
        data: [
          {
            username: savedData.lastname,
            token: '45erkjherht45495783',
          },
        ],
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        error: 'Sorry, something went wrong, try again',
      });
    }
  }
}

export default UserController;
