import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
class Booking extends Model {
    static associate(models) {
        Booking.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        Booking.belongsTo(models.Trip, {
            foreignKey: 'trip_id',
            as: 'trip'
        });
    }
}
Booking.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'confirmed', 'cancelled']]
        }
    },
    seats_requested: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    cancellation_reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    trip_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
}, {
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings',
    timestamps: true,
    paranoid: true,
    underscored: true
});
export { Booking };
export default Booking;
