const express = require('express'); // express 모듈
const router = express.Router();
const {body, param, validationResult} = require('express-validator');   
const {
    join,
    login,
    requestResetPassword,
    resetPassword
 } = require('../controller/userController');

router.use(express.json());

// 유효성 검사 모듈화
const validate = (req, res, next) => {
    const err = validationResult(req);

    if (err.isEmpty()) {
        return next();
    } else {
        return res.status(400).json(err.array());
    }
}

// 회원가입
router.post('/join',
    [
        body('email').notEmpty().isEmail().withMessage('email 확인 필요'),
        body('name').notEmpty().isString().withMessage('name 확인 필요'),
        body('password').notEmpty().isString().withMessage('password 확인 필요'),
        validate
    ]
    , join
);

// 로그인
router.post('/login',
    [
        body('email').notEmpty().isEmail().withMessage('email - invalid data'),
        body('password').notEmpty().isString().withMessage('password - invalid data'),
        validate
    ]
    , login
);

// 비밀번호 변경 요청
router.post('/reset', requestResetPassword);

// 비밀번호 변경
router.put('/reset', resetPassword);

module.exports = router;