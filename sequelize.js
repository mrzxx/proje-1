const Sequelize = require('sequelize');
const sequelize = new Sequelize('proje_iot', '', '', {
  host: 'localhost',
  dialect: 'mysql', // Veritabanı türünü seçin (örneğin, PostgreSQL, MySQL, vb.)
  timezone: '+03:00' // İstanbul için GMT+3
});
module.exports = sequelize;
