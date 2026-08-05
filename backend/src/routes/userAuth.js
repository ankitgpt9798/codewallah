const express = require('express');
const authRouter= express.Router();
const {register,login}=require('../controllers/userAuthent');


// Register

authRouter.post('/register', register);
authRouter.post('/login', login);
// authRouter.post('/logout', logout);
// authRouter.post('/getProfile', getProfile);


// login
// logout
// getprofile
module.exports = authRouter;