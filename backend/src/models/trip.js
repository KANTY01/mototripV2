export default (sequelize, DataTypes) => {
  const Trip = sequelize.define('Trip', {
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
        isDate: true,
        isAfter: function(value) {
          if (value <= this.start_date) {
            throw new Error('End date must be after start date');
          }
        }
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
    }
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 'trips'
  });

  Trip.associate = (models) => {
    Trip.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'organizer'
    });
    Trip.hasMany(models.Booking, {
      foreignKey: 'trip_id',
      as: 'bookings'
    });
    Trip.hasMany(models.Review, {
      foreignKey: 'trip_id',
      as: 'reviews'
    });
  };

  return Trip;
};
