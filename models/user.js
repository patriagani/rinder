'use strict';
const{encrypt} = require('../helpers')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    description: DataTypes.TEXT,
    gender: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    country: DataTypes.STRING,
    email: DataTypes.STRING,
    avatar: DataTypes.STRING,
    point: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate: function(user) {
        user.password = encrypt(user.password)
      }
    }
  });
  User.associate = function(models) {
    User.hasMany(models.Post)
    User.hasMany(models.Date, {foreignKey: 'SenderId'})
    User.hasMany(models.Date, {foreignKey: 'ReceiverId'})
    User.belongsToMany(User, { as: 'Target', through: 'Relation', foreignKey: 'UserId'})
    User.belongsToMany(User, { as: 'Source', through: 'Relation', foreignKey: 'FriendId'})
    User.belongsToMany(User, { as: 'Sender', through: 'Date', foreignKey: 'SenderId'})
    User.belongsToMany(User, { as: 'Receiver', through: 'Date', foreignKey: 'ReceiverId'})
  };

  User.prototype.getLevel = function () {
    if (this.gender == "male") {
      if (this.point > 10000) {
        return 'Alphamale'
      }
      else if (this.point > 500) {
        return 'Playboy'
      }
      else if (this.point > 200) {
        return 'Handsome Jackass'
      }
      else if (this.point <= 100) {
        return 'Ordinary Boy'
      }
    }
    else if (this.gender == "female") {
      if (this.point > 10000) {
        return 'Super Sexy Girl'
      }
      else if (this.point > 500) {
        return 'Will be MILF'
      }
      else if (this.point > 200) {
        return 'Naughty but Beautiful'
      }
      else if (this.point <= 100) {
        return 'Ordinary Girl'
      }
    }
  };
  return User;
};
