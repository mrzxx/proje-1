const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Önceki adımda oluşturduğumuz bağlantıyı içe aktarın

const Combi = sequelize.define('Combi', {
id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
    },
  shutdown:{
    type: DataTypes.INTEGER,
    allowNull:  false,
  },
  reason:{
    type: DataTypes.INTEGER,
    allowNull:  false,
  }
});

module.exports = Combi;
