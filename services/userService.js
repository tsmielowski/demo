const { getNow, pool } = require('./../utils/db');

const connect = () => new Promise((resolve, reject) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      reject({
        message: 'DB connection error',
        success: false
      });
    } else {
      resolve(connection);
    }
  });
});
const createUser = ({ firstName, lastName, login, password }) => new Promise((resolve, reject) => {
  connect().then(connection => {
    const now = getNow();
    const sql = `INSERT INTO user
      SET
        user_first_name = ?,
        user_last_name = ?,
        user_login = ?,
        user_password = ?,
        user_created = ?,
        user_updated = ?`;

    connection.query(sql, [ firstName, lastName, login, password, now, now ], (err, result) => {
      connection.release();

      if (err) {
        console.error(err);
        reject({
          message: 'DB query execution error',
          success: false
        });
      } else if (result.affectedRows > 0) {
        resolve({
          message: 'User created',
          success: true
        })
      } else {
        reject({
          message: 'User was not created',
          success: true
        });
      }
    });
  }, reject);
});
const deleteUser = id => new Promise((resolve, reject) => {
  connect().then(connection => {
    connection.query('DELETE FROM user WHERE user_id = ?', [ id ], (err, result) => {
      connection.release();

      if (err) {
        console.error(err);
        reject({
          message: 'DB query execution error',
          success: false
        });
      } else if (result.affectedRows > 0) {
        resolve({
          message: 'User deleted',
          success: true
        })
      } else {
        reject({
          message: 'User not found',
          success: false
        });
      }
    });
  }, reject);
});
const getUser = id => new Promise((resolve, reject) => {
  connect().then(connection => {
    connection.query('SELECT * FROM user WHERE user_id = ?', [ id ], (err, result) => {
      connection.release();

      if (err) {
        console.error(err);
        reject({
          message: 'DB query execution error',
          success: false
        });
      } else {
        resolve({
          data: result.reduce((acc, user) => ({
            id: user.user_id,
            login: user.user_login,
            firstName: user.user_first_name,
            lastName: user.user_last_name,
            createdAt: user.user_created,
            updatedAt: user.user_updated
          })),
          success: true
        })
      }
    });
  }, reject);
});
const getUsers = () => new Promise((resolve, reject) => {
  connect().then(connection => {
    connection.query('SELECT * FROM user', (err, result) => {
      connection.release();

      if (err) {
        console.error(err);
        reject({
          message: 'DB query execution error',
          success: false
        });
      } else {
        resolve({
          data: result.map(user => ({
            id: user.user_id,
            login: user.user_login,
            firstName: user.user_first_name,
            lastName: user.user_last_name,
            createdAt: user.user_created,
            updatedAt: user.user_updated
          })),
          success: true
        })
      }
    });
  }, reject);
});
const updateUser = ({ firstName, id, lastName, login, password }) => new Promise((resolve, reject) => {
  connect().then(connection => {
    const now = getNow();
    const sql = `UPDATE user
      SET
        user_first_name = ?,
        user_last_name = ?,
        user_login = ?,
        user_password = ?,
        user_updated = ?
      WHERE
        user_id = ?`;

    connection.query(sql, [ firstName, lastName, login, password, now, id ], (err, result) => {
      connection.release();
      console.log(result);

      if (err) {
        console.error(err);
        reject({
          message: 'DB query execution error',
          success: false
        });
      } else if (result.affectedRows > 0) {
        resolve({
          message: 'User updated',
          success: true
        })
      } else {
        reject({
          message: 'User not found',
          success: true
        });
      }
    });
  }, reject);
});

module.exports = {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser
};