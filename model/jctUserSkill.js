/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('jctUserSkill', {
    idUser: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    idSkill: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'skill',
        key: 'id'
      }
    }
  }, {
    tableName: 'jctUserSkill',
    freezeTableName: true
  });
};
