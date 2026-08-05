const User = require('../models/user');
const validate = require('../utils/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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


module.exports = { register, login };