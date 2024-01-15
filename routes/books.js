const express = require('express');
const router = express.Router();
const { allBooks, bookDetail } = require('../controller/BookController');

router.use(express.json());

// 전체 도서 조회
router.get('/', allBooks);
router.get('/:id', bookDetail);

module.exports = router;
