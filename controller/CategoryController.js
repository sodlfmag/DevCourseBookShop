const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allCategory = (req, res) => {
  let { category_id } = req.query;
  // 카테고리 전체 목록 리스트
  let sql = 'SELECT * FROM category';
  conn.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
    }

    res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { allCategory };
