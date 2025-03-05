const express = require('express');
const customerRoutes = require('./routes/bookings');
const app = express();

app.use(express.json());
app.use('/bookings', customerRoutes);

app.listen(3003, () => console.log('Booking Service running on port 3003'));
