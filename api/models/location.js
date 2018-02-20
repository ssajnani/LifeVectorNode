'use strict';
module.exports = (sequelize, DataTypes) => {
  const location = sequelize.define('location', {
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });
  location.associate = (models) => {
    location.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  }
  return location;
};
