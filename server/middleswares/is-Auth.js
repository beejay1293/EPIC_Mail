import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import helper from '../helper/helper';
import userData from '../data/users';
import DB from '../db/index';

dotenv.config();

class Auth {
  /**
   * trim input whitespaces
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static trimmer(req, res, next) {
    const { body } = req;
    if (body) {
      const trimmed = {};

      Object.keys(body).forEach((key) => {
        const value = body[key];
        Object.assign(trimmed, { [key]: value.trim() });
      });
      req.body = trimmed;
    }

    next();
  }

  /**
   *create a token
   * @param {*} email
   * @param {*} id
   * @param {*} isAdmin
   */
  static createToken(email, id, firstname, lastname) {
    const token = jwt.sign(
      {
        email,
        id,
        firstname,
        lastname,
      },
      process.env.SECRET,
      { expiresIn: '24h' },
    );

    return token;
  }

  /**
   *verify token provided by user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static verifyToken(req, res, next) {
    const { token } = req.headers;

    // check if token was provided
    if (!token) {
      return res.status(403).json({
        status: 403,
        error: 'Unauthorized!, you have to login',
      });
    }

    try {
      // verify user provided token against existing token
      const decoded = jwt.verify(token, process.env.SECRET);

      // check if user already exists
      const userExists = helper.findUserByEmail(userData, decoded.email);
      // check for valid user
      if (!userExists) {
        return res.status(401).json({
          status: 401,
          error: 'The token you provided is invalid',
        });
      }

      // get user id, email and isAdmin
      req.user = decoded;

      // fire next middleware
      return next();
    } catch (error) {
      return res.status(400).json({
        status: 400,
        errors: [error],
      });
    }
  }

  static async verifyTokendb(req, res, next) {
    const { token } = req.headers;

    // check if token was provided
    if (!token) {
      return res.status(403).json({
        status: 403,
        error: 'Unauthorized!, you have to login',
      });
    }

    try {
      // verify user provided token against existing token
      const decoded = jwt.verify(token, process.env.SECRET);

      const queryString = 'SELECT * FROM users WHERE id = $1';
      const { rows } = await DB.query(queryString, [decoded.id]);

      // check for valid app users
      if (!rows[0]) {
        return res.status(401).json({
          status: 401,
          error: 'The token you provided is invalid',
        });
      }

      // get user id, email and isAdmin
      req.user = decoded;

      // fire next middleware
      return next();
    } catch (error) {
      return res.status(400).json({
        status: 400,
        errors: [error],
      });
    }
  }
}

// expose auth
export default Auth;
