const express = require('express');
const router = express.Router();

router.use(express.json());

// 좋아요 추가
router.put('/:id', (req, res) => {
  // boolean 값을 이용한 좋아요 추가/삭제 모듈 단일화
  res.json('좋아요');
});
