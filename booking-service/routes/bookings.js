const express = require('express');
const axios = require('axios');
const router = express.Router();

const bookings = [];

router.post('/', async (req, res) => {
    const { userId, carId, startDate, endDate } = req.body;
    if (!userId || !carId || !startDate || !endDate) {
        return res.status(400).send('Invalid data');
    }

    try {
        const userResponse = await axios.get(`http://localhost:3002/users/${userId}`);
        const user = userResponse.data;
        if (user.activeBookings >= user.maxBookings) {
            return res.status(400).send('User has reached max booking limit');
        }

        const carResponse = await axios.get(`http://localhost:3001/cars/${carId}`);
        const car = carResponse.data;
        if (!car.isAvailable) {
            return res.status(400).send('Car is not available');
        }

        const bookingId = bookings.length + 1;
        const newBooking = { bookingId, userId, carId, startDate, endDate, status: 'active' };
        bookings.push(newBooking);

        await axios.put(`http://localhost:3002/users/${userId}`, { activeBookings: user.activeBookings + 1 });
        
        await axios.put(`http://localhost:3001/cars/${carId}`, { isAvailable: false });
        
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).send('Error processing booking');
    }
});

router.get('/:userId', (req, res) => {
    const userBookings = bookings.filter(b => b.userId == req.params.userId);
    res.json(userBookings);
});

router.delete('/:bookingId', async (req, res) => {
    const bookingIndex = bookings.findIndex(b => b.bookingId == (req.params.bookingId));
    if (bookingIndex === -1) return res.status(404).send('Booking not found');

    const booking = bookings[bookingIndex];
    if (booking.status == 'canceled') return res.status(400).send('Booking already canceled');

    try {
        const userResponse = await axios.get(`http://localhost:3002/users/${booking.userId}`);
        const user = userResponse.data;
        await axios.put(`http://localhost:3002/users/${booking.userId}`, { activeBookings: user.activeBookings - 1 });

        await axios.put(`http://localhost:3001/cars/${booking.carId}`, { isAvailable: true });

        bookings[bookingIndex].status = 'canceled';
        res.send('Booking canceled successfully');
    } catch (error) {
        res.status(500).send('Error canceling booking');
    }
});

module.exports = router;
