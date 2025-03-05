const express = require('express');
const customerRoutes = require('./routes/cars');
const app = express();

app.use(express.json());
app.use('/cars', customerRoutes);

app.listen(3001, () => console.log('Car Service running on port 3001'));
