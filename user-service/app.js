const express = require('express');
const customerRoutes = require('./routes/users');
const app = express();

app.use(express.json());
app.use('/users', customerRoutes);

app.listen(3002, () => console.log('User Service running on port 3002'));
