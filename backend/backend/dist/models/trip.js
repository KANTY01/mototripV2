import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
class Trip extends Model {
    static associate(models) {
        Trip.belongsTo(models.User, {
            foreignKey: 'created_by',
            as: 'organizer'
        });
        Trip.hasMany(models.Booking, {
            foreignKey: 'trip_id',
            as: 'bookings'
        });
    }
}
Trip.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [5, 255]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
            isAfter: new Date().toISOString().split('T')[0]
        }
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    seats_available: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    status: {
        type: DataTypes.ENUM('pending', 'active', 'rejected', 'completed'),
        allowNull: false,
        defaultValue: 'pending'
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
}, {
    sequelize,
    modelName: 'Trip',
    tableName: 'trips',
    timestamps: true,
    paranoid: true,
    underscored: true
});
export default Trip;
