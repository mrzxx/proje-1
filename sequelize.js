const Sequelize = require('sequelize');

// Veritabanı bağlantısı oluşturun
const sequelize = new Sequelize('proje_iot', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', // Veritabanı türünü seçin (örneğin, PostgreSQL, MySQL, vb.)
  timezone: '+03:00' // İstanbul için GMT+3
});

// sequelize nesnesini dışa aktarın
module.exports = sequelize;
