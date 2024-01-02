const express = require('express');
const router = express.Router();

router.use(express.json());

// 주문 하기
router.post('/', (req, res) => {
  res.json('주문 하기');
});

// 주문 목록 조회
router.post('/', (req, res) => {
  // boolean 값을 이용한 좋아요 추가/삭제 모듈 단일화
  res.json('주문 목록 조회');
});

// 주문 상세 상품 조회
router.get('/:id', (req, res) => {
  res.json('주문 상세 상품 조회');
});
