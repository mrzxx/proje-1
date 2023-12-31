const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Önceki adımda oluşturduğumuz bağlantıyı içe aktarın

const Rule = sequelize.define('rule', {
id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
    },
  rule:{
    type: DataTypes.INTEGER,
    allowNull:  false,
  },
  value:{
    type: DataTypes.TEXT,
    allowNull:  false,
  }
});

module.exports = Rule;
