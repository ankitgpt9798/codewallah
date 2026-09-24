require('dotenv').config();

const dns = require('dns');

// Set DNS BEFORE loading the database configuration
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRouter = require('./routes/userAuth');
const problemRouter = require('./routes/problemCreator');
const submitRouter = require('./routes/submit');

const main = require('./config/db');
const redisClient = require('./config/redis');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submit", submitRouter);

const InitalizeConnection = async () => {
    try {
        await Promise.all([
            main(),
            redisClient.connect()
        ]);

        console.log("DB Connected");

        app.listen(process.env.PORT, () => {
            console.log(
                "Server listening at port number: " + process.env.PORT
            );
        });

    } catch (err) {
        console.log("Error:", err);
    }
};

InitalizeConnection();