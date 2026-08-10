const express=require('express');

const problemRouter=express.Router; 
const adminMiddleware=require('../middleware/adminMiddleware');

problemRouter.post("/create",adminMiddleware.js,createProblem);