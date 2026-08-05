const authRouter = require('./routes/userAuth');
const express = require('express')
const app = express();
require('dotenv').config();
const main = require('./config/db')
const cookieParser = require('cookie-parser');
const http = require('http');
const https = require('https');
const dns = require('dns');

// Force IPv4 + Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);
http.globalAgent = new http.Agent({ family: 4 });
https.globalAgent = new https.Agent({ family: 4 });

app.use(express.json());
app.use(cookieParser());
app.use("/user", authRouter);

async function startServer() {
    try {
        await main();
        console.log("DB connected");
        app.listen(process.env.PORT, '0.0.0.0', () => {
            console.log(`Server started at port number ${process.env.PORT}`);
        });
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

startServer();