const Sequelize = require('sequelize');

// Veritabanı bağlantısı oluşturun
const sequelize = new Sequelize('proje_iot', 'fecriati', 'mytestpasswordhere2024-0001', {
  host: 'localhost',
  dialect: 'mysql', // Veritabanı türünü seçin (örneğin, PostgreSQL, MySQL, vb.)
  timezone: '+03:00' // İstanbul için GMT+3
});

// sequelize nesnesini dışa aktarın
module.exports = sequelize;
//AMAZON
//admin
//mytestpasswordhere2023

/*
CREATE USER 'fecriati'@'localhost' IDENTIFIED BY 'mytestpasswordhere2023';
GRANT ALL PRIVILEGES ON *.* TO 'fecriati'@'localhost';
FLUSH PRIVILEGES;


CREATE USER 'myuser'@'localhost' IDENTIFIED BY 'mystrongpassword';
GRANT ALL PRIVILEGES ON mydatabase.* TO 'myuser'@'localhost';
FLUSH PRIVILEGES;
*/