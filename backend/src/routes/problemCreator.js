const express=require('express');

const problemRouter=express.Router; 
const adminMiddleware=require('../middleware/adminMiddleware');
const {createProblem,updateProblem} = require("../controllers/userProblem");


problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.put("/update/:id",adminMiddleware,updateProblem);

module.exports=problemRouter;