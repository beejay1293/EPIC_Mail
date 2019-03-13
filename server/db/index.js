import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

// Instantiate pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class Db {
  /**
   * query() queries database
   *
   * @param {string} queryString
   * @param {*} params
   */
  static query(queryString, params) {
    return new Promise((resolve, reject) => {
      pool
        .query(queryString, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export default Db;
