const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');
const Event = require('./event.model');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.ENUM('confirmed', 'cancelled'),
        defaultValue: 'confirmed'
    },
    bookingDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['eventId', 'userId']
        }
    ]
});

// Define associations
Booking.belongsTo(User, { foreignKey: 'userId' });
Booking.belongsTo(Event, { foreignKey: 'eventId' });
User.hasMany(Booking, { foreignKey: 'userId' });
Event.hasMany(Booking, { foreignKey: 'eventId' });

module.exports = Booking; 