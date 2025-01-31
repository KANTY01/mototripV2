import { Sequelize, DataTypes } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_URL,
  logging: false
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.User = (await import('./user.js')).default(sequelize, DataTypes)
db.Trip = (await import('./trip.js')).default(sequelize, DataTypes)
db.TripImage = (await import('./tripImage.js')).default(sequelize, DataTypes)
db.Review = (await import('./review.js')).default(sequelize, DataTypes)
db.ReviewImage = (await import('./reviewImage.js')).default(sequelize, DataTypes)
db.Follower = (await import('./follower.js')).default(sequelize, DataTypes)
db.Subscription = (await import('./subscription.js')).default(sequelize, DataTypes)

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

export default db
