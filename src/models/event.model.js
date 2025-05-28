const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');

const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    dateTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    totalSeats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    availableSeats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    }
}, {
    timestamps: true,
    hooks: {
        beforeValidate: (event) => {
            if (event.availableSeats > event.totalSeats) {
                throw new Error('Available seats cannot exceed total seats');
            }
        }
    }
});

// Define associations
Event.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
User.hasMany(Event, { foreignKey: 'createdBy' });

module.exports = Event; 