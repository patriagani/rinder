'use strict';
module.exports = (sequelize, DataTypes) => {
  const Relation = sequelize.define('Relation', {
    UserId: DataTypes.INTEGER,
    FriendId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {});
  Relation.associate = function(models) {
    // associations can be defined here
  };
  return Relation;
};