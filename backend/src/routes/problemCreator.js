const express=require('express');
const problemRouter=express.Router(); 

const adminMiddleware=require('../middleware/adminMiddleware');
const userMiddleware=require('../middleware/userMiddleware');
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem} = require("../controllers/userProblem");
const { getLanguageById } = require('../utils/problemUtility');


problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.put("/update/:id",adminMiddleware,updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);
problemRouter.get("/getproblemById/:id",userMiddleware,getProblemById);
problemRouter.get("/getAllProblem",userMiddleware,getAllProblem);

module.exports=problemRouter;