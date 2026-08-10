const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redis');

const userMiddleware = async (req, res, next) => {

    try {

        const { token } = req.cookies;

        if (!token)
            throw new Error("tocken is not present")

        const payload = jwt.verify(token.process.env.JWT_SECRET_KEY);

        const { _id } = payload;
        if (!_id)
            throw new Error("invalid id")

        const result = await User.findById(_id);
        if (!result)
            throw new Error("user doesn't exist")

        // Redis ke blockList mein persent toh nahi hai

        const IsBlocked = await redisClient.exists(`token:${token}`);

        // doubt
        if (IsBlocked)
            throw new Error("Invalid Token");

        req.result = result;

        next();

    }

    catch (err) {
        res.status(401).send("Error: " + err.message)
    }

}

module.exports = userMiddleware;