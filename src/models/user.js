export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user'
    },
    experience_level: {
      type: DataTypes.STRING
    },
    preferred_routes: {
      type: DataTypes.TEXT
    },
    motorcycle_details: {
      type: DataTypes.TEXT
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  })

  return User
}
