const express = require('express');
const router = express.Router();
const { 
    getAllCategory
} = require('../controller/categoryController');

router.use(express.json());

// 전체 카테고리 조회
router.get('/', getAllCategory);

module.exports = router;