const express = require('express');
const router = express.Router();
let users = require('../data/users');

router.post('/', (req, res) => {
    const { id, name, email, activeBookings } = req.body;
    if (!id || !name || !email) return res.status(400).send('Invalid data');
    // const newUser=
    const newUser = { id, name, email, maxBookings:3, activeBookings};
    users.push(newUser);
    res.status(201).send('User registered');
});

router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.json(user);
});

router.put('/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).send('User not found');
    user.activeBookings = req.body.activeBookings;
    res.send('Active Bookings updated');
});

module.exports = router;
