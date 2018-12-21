'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    UserId: DataTypes.INTEGER,
    message: DataTypes.STRING
  }, {});
  Post.associate = function(models) {
    Post.belongsTo(models.User)
  };
  return Post;
};