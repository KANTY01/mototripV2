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
    route_type: {
        type: DataTypes.ENUM('highway', 'offroad', 'mixed'),
        allowNull: false,
        defaultValue: 'highway'
    },
    required_experience: {
        type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
        allowNull: false,
        defaultValue: 'beginner'
    },
    motorcycle_types: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    route_highlights: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    route_map_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    required_gear: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    distance_km: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    estimated_duration: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '0h'
    },
    terrain_difficulty: {
        type: DataTypes.ENUM('easy', 'moderate', 'challenging'),
        allowNull: false,
        defaultValue: 'easy'
    },
    rest_stops: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    weather_info: {
        type: DataTypes.JSON,
        allowNull: true
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
