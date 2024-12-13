const express = require('express');
const router = express.Router();

router.use(express.json());

// 담기
router.post('/', (req, res) => {
    res.json();
});

// 조회
router.get('/', (req, res) => {

});

// 삭제
router.delete('/:id', (req, res) => {

});

// 선택된 주문 예상 상품 목록 조회
// router.get('/', (req, res) => {
    
// })

module.exports = router;