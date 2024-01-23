const mariadb = require('mysql2/promise');
const connection = async () => {
  const conn = await mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'DBdufruf1!',
    database: 'Bookshop',
    dateString: true,
  });

  return conn;
};

module.exports = connection;
