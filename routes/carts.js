const express = require('express');
const { addCartItem, getCartItems, removeCartItem } = require('../controller/cartController');
const router = express.Router();

router.use(express.json());

// 담기
router.post('/', addCartItem);

// 조회
router.get('/', getCartItems
);

// 삭제
router.delete('/:id', removeCartItem);

module.exports = router;