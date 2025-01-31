export default (sequelize, DataTypes) => {
  const UserAchievement = sequelize.define('UserAchievement', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    achievement_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Achievements',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    createdAt: 'achieved_at',
    updatedAt: false
  })

  return UserAchievement
}
