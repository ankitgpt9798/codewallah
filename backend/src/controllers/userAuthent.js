const User = require('../models/user');
const validate = require('../utils/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');



const register = async (req, res) => {
    // validate the user
    try {
        validate(req.body);

        const { firstName, emailId, password } = req.body;

        const hashedPass = await bcrypt.hash(password, 10);

        const user = await User.create({ firstName, emailId, password: hashedPass });

        const token = jwt.sign({ _id: user._id, emailId: emailId }, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 60 });
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });

        res.status(201).send("User Registered Successfully");
    }

    catch (err) {
        res.status(400).send(err.message);
    }
}

// login
const login = async (req, res) => {

    try {
        const { emailId, password } = req.body;
        // check valid  email and pass 
        if (!emailId)
            throw new Error("Invalid credentials");
        if (!password)
            throw new Error("Invalid credentials");

        const user = await User.findOne({ emailId });

        const match = await bcrypt.compare(password, user.password);

        if (!match)
            throw new Error("Invalid credentials");

        const token = jwt.sign({ _id: user._id, emailId: emailId }, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 60 });
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });

        res.status(201).send("User login Successfully");
    }
    catch (err) {
        res.status(400).send("Error" + err);
    }

}

const logout = async (req, res) => {
    try {
        const { token } = req.cookies;
        const payload = jwt.decode(token);

        // tocken ko blocklist me add krna
        await redisClient.set(`token:${token}`, 'Blocked');
        await redisClient.expireAt(`token:${token}`, payload.exp);

        // cookies ko expire krna
        res.cookie("token", null, { expires: new Date(Date.now()) });
        res.send("Logged Out Succesfully");
    }
    catch (err) {
        res.status(503).send("Error" + err);
    }
}

const adminRegister = async (req, res) => {
    // validate the user
    try {
        validate(req.body);

        const { firstName, emailId, password } = req.body;

        const hashedPass = await bcrypt.hash(password, 10);

        const user = await User.create({ firstName, emailId, password: hashedPass });

        const token = jwt.sign({ _id: user._id, emailId: emailId, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 60 });
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });

        res.status(201).send("User Registered Successfully");
    }

    catch (err) {
        res.status(400).send(err.message);
    }
}



module.exports = { register, login, logout, adminRegister };