const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const signup = (req, res) => {
  const { email, password } = req.body;

  // 암호화된 비밀번호와 salt를 DB에 같이 저장
  const salt = crypto.randomBytes(64).toString('base64');
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('base64');

  let sql = 'INSERT INTO users (email, password, salt) VALUES (?, ?, ?)';
  let values = [email, hashPassword, salt];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
    }

    res.status(StatusCodes.CREATED).json({
      message: '회원가입 성공!',
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  let sql = 'SELECT * FROM users WHERE email = ? ';
  conn.query(sql, email, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
    }

    const loginUser = results[0];

    const hashPassword = crypto
      .pbkdf2Sync(password, loginUser.salt, 10000, 64, 'sha512')
      .toString('base64');

    if (loginUser && loginUser.password == hashPassword) {
      const token = jwt.sign(
        {
          email: loginUser.email,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: '5m',
          issuer: 'Jin',
        }
      );
      // 토큰 쿠키에 담기
      res.cookie('token', token, {
        httpOnly: true,
      });
      console.log(token);

      res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.UNAUTHORIZED);
    }
  });
};

const requestResetPassword = (req, res) => {
  const { email } = req.body;

  let sql = 'SELECT * FROM users WHERE email = ?';
  conn.query(sql, email, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
    }

    // 이메일로 유저 validattion
    const user = results[0];
    if (user) {
      return res.status(StatusCodes.OK).json({
        email: email,
      });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

const passwordReset = (req, res) => {
  const { email, password } = req.body;
  let sql = `UPDATE users SET password = ?, salt=?  WHERE email =?`;

  const salt = crypto.randomBytes(64).toString('base64');
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('base64');
  let values = [password, salt, email];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
    }
    if (results.affectedRows == 0)
      return res.status(StatusCodes.BAD_REQUEST).end();
    else return res.status(StatusCodes.OK).json(results);
  });
};
module.exports = {
  signup,
  login,
  requestResetPassword,
  passwordReset,
};
