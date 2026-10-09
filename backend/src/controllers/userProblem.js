
const { getLanguageById, submitBatch, submitToken, getDriverCode, buildSource, USER_CODE_PLACEHOLDER } = require("../utils/problemUtility");
const Problem = require('../models/problem');
const Submission = require('../models/submission');

// Builds a readable message from a failed Judge0 result
const judgeErrorMessage = (language, test) => {
    const parts = [`Reference solution (${language}) failed: ${test.status?.description || 'Unknown status'}`];
    if (test.compile_output) parts.push(`Compile output: ${test.compile_output}`);
    if (test.stderr) parts.push(`Stderr: ${test.stderr}`);
    if (test.status_id == 4) {
        parts.push(`Input: ${test.stdin}`);
        parts.push(`Expected: ${test.expected_output}`);
        parts.push(`Got: ${test.stdout}`);
    }
    return parts.join('\n');
}

// Runs every reference solution (wrapped in its driver code) on the visible test cases.
// Returns null when all pass, otherwise { status, body } describing the failure.
const validateProblem = async ({ visibleTestCases, referenceSolution, driverCode }) => {
    if (!Array.isArray(referenceSolution) || referenceSolution.length === 0)
        return { status: 400, body: { message: "Reference solution is required" } };
    if (!Array.isArray(visibleTestCases) || visibleTestCases.length === 0)
        return { status: 400, body: { message: "At least one visible test case is required" } };

    for (const driver of driverCode || []) {
        if (driver.code && !driver.code.includes(USER_CODE_PLACEHOLDER))
            return { status: 400, body: { message: `Driver code (${driver.language}) must contain ${USER_CODE_PLACEHOLDER} where the user's code goes` } };
    }

    for (const { language, completeCode } of referenceSolution) {

        const languageId = getLanguageById(language);
        if (!languageId)
            return { status: 400, body: { message: `Unsupported language: ${language}` } };

        const sourceCode = buildSource(completeCode, getDriverCode({ driverCode }, language));

        const submissions = visibleTestCases.map((testcase) => ({
            source_code: sourceCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult.map((value) => value.token);

        const testResult = await submitToken(resultToken);

        for (const test of testResult) {
            if (test.status_id != 3) {
                const { source_code, ...result } = test;
                return { status: 400, body: { message: judgeErrorMessage(language, test), result } };
            }
        }
    }
    return null;
}

// Judge0 request failures carry the reason in err.response.data
const serverErrorMessage = (err) => {
    const judgeError = err.response?.data ? ` (Judge0: ${JSON.stringify(err.response.data)})` : '';
    return "Error: " + err.message + judgeError;
}

const createProblem = async (req, res) => {
    try {
        const failure = await validateProblem(req.body);
        if (failure)
            return res.status(failure.status).json(failure.body);

        // We can store it in our DB
        await Problem.create({
            ...req.body,
            problemCreator: req.result._id
        });

        res.status(201).json({ message: "Problem Saved Successfully" });

    }
    catch (err) {
        console.error("CREATE PROBLEM ERROR:", err);
        res.status(400).json({ message: serverErrorMessage(err) });
    }
}

const updateProblem = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({ message: "Missing Id Field" });
        }
        const DsaProblem = await Problem.findById(id);
        if (!DsaProblem) {
            return res.status(404).json({ message: "Id is not present in server" });
        }

        const failure = await validateProblem(req.body);
        if (failure)
            return res.status(failure.status).json(failure.body);

        const newProblem = await Problem.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true });

        res.status(200).send(newProblem);
    }
    catch (err) {
        console.error("UPDATE PROBLEM ERROR:", err);
        res.status(500).json({ message: serverErrorMessage(err) });
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

    // Hidden test cases and driver code must never reach the browser
    const getProblem = await Problem.findById(id).select('-hiddenTestCases -driverCode');

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
     
    const getProblem = await Problem.find({}).select('_id title difficulty tags');

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
    return res.status(200).send("No Submission is persent");

  return res.status(200).send(ans);

  }
  catch(err){
     res.status(500).send("Internal Server Error");
  }
}



module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,submittedProblem};