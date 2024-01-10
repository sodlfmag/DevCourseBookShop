const mariabd = require('mysql2');
const connection = mariabd.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Bookshop',
  dateString: true,
});

module.exports = connection;
