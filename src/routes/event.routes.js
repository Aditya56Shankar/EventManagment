const express = require('express');
const router = express.Router();
const Event = require('../models/event.model');
const { auth, isAdmin } = require('../middleware/auth.middleware');

// Get all events (public)
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ dateTime: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
});

// Get single event (public)
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event', error: error.message });
    }
});

// Create event (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
    try {
        const { title, description, dateTime, location, totalSeats } = req.body;

        const event = new Event({
            title,
            description,
            dateTime,
            location,
            totalSeats,
            availableSeats: totalSeats,
            createdBy: req.user._id
        });

        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
});

// Update event (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
    try {
        const { title, description, dateTime, location, totalSeats } = req.body;

        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Calculate new available seats
        const bookedSeats = event.totalSeats - event.availableSeats;
        const newAvailableSeats = totalSeats - bookedSeats;

        if (newAvailableSeats < 0) {
            return res.status(400).json({ message: 'Cannot reduce total seats below booked seats' });
        }

        event.title = title;
        event.description = description;
        event.dateTime = dateTime;
        event.location = location;
        event.totalSeats = totalSeats;
        event.availableSeats = newAvailableSeats;

        await event.save();
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
});

// Delete event (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        await event.deleteOne();
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
});

module.exports = router; 