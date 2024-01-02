const express = require('express');
const router = express.Router();

router.use(express.json());

// 회원가입
router.post('/signup', (req, res) => {
  res.json('회원가입');
});

// 로그인
router.post('/login');

// 비밀번호 초기화 쵸어
router.post('/reset');

// 비밀번호 초기화
router.put('/reset');

module.exports = router;
