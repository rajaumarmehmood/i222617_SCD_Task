const express = require('express');
const router = express.Router();
let cars = require('../data/cars');

router.post('/', (req, res) => {
    const { id, model, location, isAvailable } = req.body;
    if (!id || !model || !location || !isAvailable) return res.status(400).send('Invalid data');
    // const newUser=
    const newCar = { id, model, location, isAvailable};
    cars.push(newCar);
    res.status(201).send('Car Added');
});

router.get('/:id', (req, res) => {
    const car = cars.find(c => c.id === req.params.id);
    if (!car) return res.status(404).send('Car not found');
    res.json(car);
});

router.put('/:id', (req, res) => {
    const car = cars.find(c => c.id === req.params.id);
    if (!car) return res.status(404).send('Car not found');
    car.isAvailable = req.body.isAvailable;
    res.send('Availability updated');
});

module.exports = router;
