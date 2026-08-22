
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");
const Problem = require('../models/problem');

const createProblem = async (req, res) => {
    const { title, description, difficulty, tags,
        visibleTestCases, hiddenTestCases, startCode,
        referenceSolution, problemCreator
    } = req.body;

    try {

        for (const { language, completeCode } of referenceSolution) {

            const languageId = getLanguageById(language);

            const submissions = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));
            const submitResult = await submitBatch(submissions);

            const resultToken = submitResult.map((value) => value.token);

            const testResult = await submitToken(resultToken);

            for (const test of testResult) {
                if (test.status_id != 3) {
                    return res.status(400).send("Error occured");
                }
            }

        }
        // We can store it in our DB
        const userProblem = await Problem.create({
            ...req.body,
            problemCreator: req.result._id
        });

        res.status(201).send("Problem Saved Successfully");

    }
    catch (err) {
        res.status(400).send("Error: " + err);
    }
}

const updateProblem = async (req, res) => {
    const { id } = req.params;
    const { title, description, difficulty, tags,
        visibleTestCases, hiddenTestCases, startCode,
        referenceSolution, problemCreator
    } = req.body;

    try {
        if (!id) {
            return res.status(400).send("Missing Id Field");
        }
        const DsaProblem = await Problem.findById(id);
        if (!DsaProblem) {
            return res.status(404).send("Id is not present in server");
        }

        for (const { language, completeCode } of referenceSolution) {

            const languageId = await getLanguageById(language);

            const submission = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output

            }))

            const submitResult = await submitBatch(submission);
            const resultToken = submitResult.map((value) => value.token);
            const testResult = await submitToken(resultToken);
            for (const test of testResult) {
                if (test.status_id != 3) {
                    return res.status(400).send("Error Occured");
                }
            }
        }
        const newProblem = await Problem.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true });

        res.status(200).send(newProblem);
    }
    catch (err) {
        res.status(500).send("Error: " + err);
    }

}

const deleteProblem= async (req,res)=>{
    const {id}=req.params;
    try{
      if(!id){
        return res.status(400).send("Id is missing");
      }

      const deletedProblem=await Problem.findByIdAndDelete(id);

      if(!deletedProblem){
        return res.status(404).send("problem is missing");
      }
      res.status(200).send("Successfully deleted");

    }
    catch(err){
res.status(500).send("Error: "+err);
    }
}

const getProblemById = async(req,res)=>{

  const {id} = req.params;
  try{
     
    if(!id)
      return res.status(400).send("ID is Missing");

    const getProblem = await Problem.findById(id);

   if(!getProblem)
    return res.status(404).send("Problem is Missing");


   res.status(200).send(getProblem);
  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}
const getAllProblem = async(req,res)=>{

  try{
     
    const getProblem = await Problem.find({});

   if(getProblem.length==0)
    return res.status(404).send("Problem is Missing");


   res.status(200).send(getProblem);
  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}

const submittedProblem = async(req,res)=>{

  try{
     
    const userId = req.result._id;
    const problemId = req.params.pid;

  const ans = await Submission.find({userId,problemId});
  
  if(ans.length==0)
    res.status(200).send("No Submission is persent");

  res.status(200).send(ans);

  }
  catch(err){
     res.status(500).send("Internal Server Error");
  }
}



module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,submittedProblem};