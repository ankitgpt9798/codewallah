require('dotenv').config();
const express = require('express')
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/userAuth');
const problemRouter = require("./routes/problemCreator");
const submitRouter=require('./routes/submit')

const main = require('./config/db')
const redisClient = require('./config/redis');

const http = require('http');
const https = require('https');
const dns = require('dns');



const app = express();

// Force IPv4 + Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);
http.globalAgent = new http.Agent({ family: 4 });
https.globalAgent = new https.Agent({ family: 4 });

app.use(express.json());
app.use(cookieParser());
app.use("/user", authRouter);
app.use('/problem',problemRouter);
app.use('/submit',submitRouter);

const InitalizeConnection = async () => {
    try {

        await Promise.all([main(), redisClient.connect()]);
        console.log("DB Connected");

        app.listen(process.env.PORT, () => {
            console.log("Server listening at port number: " + process.env.PORT);
        })

    }
    catch (err) {
        console.log("Error: " + err);
    }
}


InitalizeConnection();