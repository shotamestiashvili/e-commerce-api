const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')

dotenv.config();

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);


mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('DB connection success!...'))
    .catch((err) => { console.log(err) });

app.listen(process.env.PORT || 5000, () => {
    console.log('E-commerce API is runing!...');
});