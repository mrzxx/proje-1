const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Önceki adımda oluşturduğumuz bağlantıyı içe aktarın

const User = sequelize.define('User', {
id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
    },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastlogin:{
    type: DataTypes.DATE(0),
    allowNull:  true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  province: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = User;
