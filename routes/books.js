const express = require('express');
const router = express.Router();
const { 
    getAllBooks, 
    getBookDetail, 
} = require('../controller/bookController');

router.use(express.json());

// 전체 도서 조회
router.get('/', getAllBooks);

// 개별 도서 조회
router.get('/:id', getBookDetail);

module.exports = router;