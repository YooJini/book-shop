const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');  // http-status-codes 모듈
const jwt = require('jsonwebtoken');    // jwt 모듈
const crypto = require('crypto');   // 암호화 모듈
const dotenv = require('dotenv');
dotenv.config();

const join = (req, res) => {
    const { email, password } = req.body;

    // 비밀번호 암호화
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    const sql = 'INSERT INTO users (email, password, salt) VALUES (?, ?, ?)';
    // 암호화된 비밀번호, salt 저장
    // => 로그인시 입력받은 비밀번호를 salt로 암호화하고, 이 값을 db에 저장되어 있는 비밀번호와 비교해볼 것
    let values = [email, hashPassword, salt];
    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.CREATED).json(results);
    });
};

const login = (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    conn.query(sql, [email], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        const loginUser = results[0];
        const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000, 10, 'sha512').toString('base64');
        if (loginUser && loginUser.password === hashPassword) {
            const token = jwt.sign({
                email: loginUser.email
            }, process.env.PRIVATE_KEY, {
                expiresIn: '5m',
                issuer: 'jini'
            });

            res.cookie('token', token, {
                httpOnly: true
            });

            console.log(token);

            return res.status(StatusCodes.OK).json(results);
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }
    })
};

const requestResetPassword = (req, res) => {
    const { email } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    conn.query(sql, [email], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        const user = results[0];
        if (user) {
            return res.status(StatusCodes.OK).json({
                email: email
            });
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }
    })
};

const resetPassword = (req, res) => {
    const { email, password } = req.body;

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');
    
    const sql = 'UPDATE users SET password = ?, salt = ? WHERE email = ?';
    const values = [hashPassword, salt, email];
    conn.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if (results.affectedRows === 0) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        } else {
            return res.status(StatusCodes.OK).json(results);
        }
    })
};

module.exports = {
    join,
    login,
    requestResetPassword,
    resetPassword
};