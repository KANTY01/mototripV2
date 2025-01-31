import { Sequelize, DataTypes } from 'sequelize'
import dotenv from 'dotenv'
import User from './user.js'
import Trip from './trip.js'
import TripImage from './tripImage.js'
import Review from './review.js'
import ReviewImage from './reviewImage.js'
import Follower from './follower.js'
import Subscription from './subscription.js'
import Achievement from './achievement.js'
import UserAchievement from './userAchievement.js'

dotenv.config()

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_URL,
  logging: false
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

// Initialize models
db.User = User(sequelize, DataTypes)
db.Trip = Trip(sequelize, DataTypes)
db.TripImage = TripImage(sequelize, DataTypes)
db.Review = Review(sequelize, DataTypes)
db.ReviewImage = ReviewImage(sequelize, DataTypes)
db.Follower = Follower(sequelize, DataTypes)
db.Subscription = Subscription(sequelize, DataTypes)
db.Achievement = Achievement(sequelize, DataTypes)
db.UserAchievement = UserAchievement(sequelize, DataTypes)

// Define associations
db.User.hasMany(db.Trip, { foreignKey: 'created_by' })
db.Trip.belongsTo(db.User, { foreignKey: 'created_by' })
db.Trip.hasMany(db.TripImage, { foreignKey: 'trip_id' })
db.TripImage.belongsTo(db.Trip, { foreignKey: 'trip_id' })
db.User.hasMany(db.Review, { foreignKey: 'user_id' })
db.Review.belongsTo(db.User, { foreignKey: 'user_id' })
db.Trip.hasMany(db.Review, { foreignKey: 'trip_id' })
db.Review.belongsTo(db.Trip, { foreignKey: 'trip_id' })
db.Review.hasMany(db.ReviewImage, { foreignKey: 'review_id' })
db.ReviewImage.belongsTo(db.Review, { foreignKey: 'review_id' })
db.User.belongsToMany(db.User, {
  as: 'Followers',
  through: db.Follower,
  foreignKey: 'following_id',
  otherKey: 'follower_id'
})
db.User.belongsToMany(db.User, {
  as: 'Following',
  through: db.Follower,
  foreignKey: 'follower_id',
  otherKey: 'following_id'
})
db.User.hasMany(db.Subscription, { foreignKey: 'user_id' })
db.Subscription.belongsTo(db.User, { foreignKey: 'user_id' })

// Achievement associations
db.User.belongsToMany(db.Achievement, {
  through: db.UserAchievement,
  foreignKey: 'user_id',
  otherKey: 'achievement_id'
})
db.Achievement.belongsToMany(db.User, {
  through: db.UserAchievement,
  foreignKey: 'achievement_id',
  otherKey: 'user_id'
})

export default db
