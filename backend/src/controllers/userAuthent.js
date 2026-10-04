const User = require('../models/user');
const validate = require('../utils/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const { signupSchema } = require("../utils/validation");



const register = async (req, res) => {
    try {

        const result = signupSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: result.error.issues[0].message
            });
        }

        const { firstName, emailId, password } = result.data;

        const existingUser = await User.findOne({ emailId });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            emailId,
            password: hashedPassword
        });

        // Create JWT token after registration
        const token = jwt.sign(
            {
                _id: user._id,
                emailId: user.emailId,
                role: user.role
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: 60 * 60
            }
        );

        // Store token in cookie
        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                firstName: user.firstName,
                emailId: user.emailId
            }
        });

    } catch (err) {

        console.error("REGISTER ERROR:", err);

        return res.status(500).json({
            message: err.message
        });
    }
};
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
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match)
            throw new Error("Invalid credentials");

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id
        }

        const token = jwt.sign({ _id: user._id, emailId: user.emailId, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 60 });
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });

        res.status(201).json({
            user: reply,
            message: "Login Sucessfully"
        })
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

const deleteProfile = async (req, res) => {

    try {
        const userId = req.result._id;

        // userSchema delete
        await User.findByIdAndDelete(userId);

        res.status(200).send("Deleted Successfully");

    }
    catch (err) {

        res.status(500).send("Internal Server Error");
    }
}

const checkAuth = async (req, res) => {
    try {
        const user = req.result;

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id
        };

        res.status(200).json({
            user: reply
        });

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};



module.exports = {
    register,
    login,
    logout,
    adminRegister,
    deleteProfile,
    checkAuth
};