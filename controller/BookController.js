const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const bookDetail = (req, res) => {
  let { id } = req.params;

  let sql = `SELECT * FROM books LEFT
  JOIN category ON books.category_id = category.id
  WHERE books.id=?;`;
  conn.query(sql, id, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end(); // BAD REQUEST
    }
    if (results[0]) return res.status(StatusCodes.OK).json(results[0]);
    else return res.status(StatusCodes.NOT_FOUND).end();
  });
};

const allBooks = (req, res) => {
  let { category_id, latest, limit, currentPage } = req.query;

  // limit : page 당 도서 수
  // currentPage : 현재 위치한 페이지 번호
  // offset : (currentPage -1) * limit
  let offset = limit * (currentPage - 1);

  let sql = 'SELECT * FROM books';
  let values = [];

  if (category_id && latest) {
    sql +=
      ' WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
    values = [category_id];
  } else if (category_id) {
    sql += ' WHERE category_id=?';
    values = [category_id];
  } else if (latest) {
    sql +=
      ' WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
  }

  sql += ' LIMIT ? OFFSET ?';
  values.push(parseInt(limit), offset);

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results.length) return res.status(StatusCodes.OK).json(results);
    else return res.status(StatusCodes.NOT_FOUND).end();
  });
};

module.exports = {
  bookDetail,
  allBooks,
};
