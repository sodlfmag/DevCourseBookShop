const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const bookDetail = (req, res) => {
  let { user_id } = req.body;
  let book_id = req.params.id;

  let sql = `SELECT *,
                  (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS total_likes,
                  (SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked
              FROM books LEFT JOIN category 
              ON books.category_id = category.category_id
              WHERE books.id =?;`;
  let values = [user_id, book_id, book_id];
  conn.query(sql, values, (err, results) => {
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

  let sql =
    'SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books';
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
