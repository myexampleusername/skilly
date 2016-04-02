/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('creds', {
    idUser: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'creds',
    freezeTableName: true
  });
};
