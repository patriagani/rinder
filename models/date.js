'use strict';
module.exports = (sequelize, DataTypes) => {
  const Date = sequelize.define('Date', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    SenderId: DataTypes.INTEGER,
    ReceiverId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  Date.associate = function(models) {
    Date.belongsTo(models.User, { as: 'Pengirim', foreignKey: 'SenderId'})
    Date.belongsTo(models.User, {as: 'Penerima', foreignKey: 'ReceiverId'})

  };
  return Date;
};