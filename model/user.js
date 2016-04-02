/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nameLast: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nameFirst: {
      type: DataTypes.STRING,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cell: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idTitle: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'title',
        key: 'id'
      }
    }
  }, {
    tableName: 'user',
    freezeTableName: true
  });
};
