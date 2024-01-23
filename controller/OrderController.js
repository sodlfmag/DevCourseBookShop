// const conn = require('../mariadb');
const mariadb = require('mysql2/promise');
const { StatusCodes } = require('http-status-codes');

const order = async (req, res) => {
````

  const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } =
    req.body;

  let delivery_id;
  let order_id;

  // delivery 테이블 삽입
  // let sql = 'INSERT INTO delivery (address, recipient, contact) VALUES (?,?,?)';
  // let values = [delivery.address, delivery.recipient, delivery.contact];

  // let [results] = await conn.execute(sql, values);
  // delivery_id = results.insertId;

  // // orders 테이블 삽입
  // sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
  //           VALUES(?, ?, ?, ?, ?)`;
  // values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];
  // [results] = await conn.execute(sql, values);
  // order_id = results.insertId;

  // //orderedBook 테이블 삽입
  // sql = `INSERT INTO orderedBook (order_id, book_id, quantity)
  //           VALUES ?;`;
  // values = [];

  // // items 배열 하나씩 순회하며 value에 push
  // items.forEach((item) => {
  //   values.push([order_id, item.book_id, item.quantity]);
  // });

  // results = await conn.query(sql, [values]);
  // console.log(results[0]);

  let result = deleteCartItems(conn);
  // console.log('결과는' + result);
  return res.status(StatusCodes.OK).json(result);
};

const deleteCartItems = async (conn) => {
  try {
    let sql = `DELETE FROM cartItems WHERE id IN (?)`;
    let values = [1, 2, 3];

    let [result] = await conn.query(sql, values);
    console.log(result);
    return result;
  } catch (error) {
    console.error('카트 아이템 삭제 오류:', error);
    throw error;
  }
};

const getOrders = (req, res) => {
  res.json('가져오기');
};

const getOrderDetail = (req, res) => {
  res.json('디테일 가져오기');
};

module.exports = {
  order,
  getOrders,
  getOrderDetail,
};
