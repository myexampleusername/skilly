/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('title', {
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'title',
    freezeTableName: true
  });
};
