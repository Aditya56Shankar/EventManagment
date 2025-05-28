const express = require('express');
const router = express.Router();
const Booking = require('../models/booking.model');
const Event = require('../models/event.model');
const { auth } = require('../middleware/auth.middleware');

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('event')
            .sort({ bookingDate: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
});

// Book an event
router.post('/:eventId', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if seats are available
        if (event.availableSeats <= 0) {
            return res.status(400).json({ message: 'No seats available' });
        }

        // Check if user already has a booking for this event
        const existingBooking = await Booking.findOne({
            event: event._id,
            user: req.user._id
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'You have already booked this event' });
        }

        // Create booking
        const booking = new Booking({
            event: event._id,
            user: req.user._id
        });

        // Update available seats
        event.availableSeats -= 1;
        await event.save();
        await booking.save();

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error booking event', error: error.message });
    }
});

// Cancel booking
router.delete('/:bookingId', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user owns the booking
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        // Check if booking is already cancelled
        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        // Update event's available seats
        const event = await Event.findById(booking.event);
        event.availableSeats += 1;
        await event.save();

        // Update booking status
        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling booking', error: error.message });
    }
});

module.exports = router; 