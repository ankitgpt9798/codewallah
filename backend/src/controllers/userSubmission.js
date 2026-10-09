const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const {getLanguageById,submitBatch,submitToken,getDriverCode,buildSource} = require("../utils/problemUtility");

const submitCode = async (req, res) => {

    try {

        const userId = req.result._id;
        const problemId = req.params.id;

        let { code, language } = req.body;

        // Validate fields
        if (!userId || !code || !problemId || !language) {
            return res.status(400).send("Some field missing");
        }

        // Keep original language for MongoDB
        const submissionLanguage = language;

        // Convert only for Judge0
        let judgeLanguage = language;

        if (judgeLanguage === 'cpp') {
            judgeLanguage = 'c++';
        }

        console.log("Submission language:", submissionLanguage);
        console.log("Judge0 language:", judgeLanguage);


        // Fetch problem
        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).send("Problem not found");
        }


        // Store submission in database
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language: submissionLanguage,
            status: 'pending',
            testCasesTotal: problem.hiddenTestCases.length
        });


        // Get Judge0 language ID
        const languageId = getLanguageById(judgeLanguage);

        if (!languageId) {
            return res.status(400).send("Unsupported language");
        }


        // Wrap the user's function in the problem's hidden driver code
        const sourceCode = buildSource(code, getDriverCode(problem, judgeLanguage));

        // Prepare hidden test cases
        const submissions = problem.hiddenTestCases.map((testcase) => ({
            source_code: sourceCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));


        // Send code to Judge0
        const submitResult = await submitBatch(submissions);

        const resultToken = submitResult.map(
            (value) => value.token
        );


        // Get Judge0 results
        const testResult = await submitToken(resultToken);


        // Process results
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;

        let status = 'accepted';
        let errorMessage = null;


        for (const test of testResult) {

            if (test.status_id == 3) {

                testCasesPassed++;

                runtime += parseFloat(test.time || 0);

                memory = Math.max(
                    memory,
                    test.memory || 0
                );

            } else {

                if (test.status_id == 4) {

                    status = 'error';

                    errorMessage =
                        test.stderr ||
                        'Runtime error';

                } else {

                    status = 'wrong';

                    errorMessage =
                        test.stderr ||
                        test.compile_output ||
                        'Wrong answer';
                }
            }
        }


        // Update submission
        submittedResult.status = status;

        submittedResult.testCasesPassed =
            testCasesPassed;

        submittedResult.errorMessage =
            errorMessage;

        submittedResult.runtime =
            runtime;

        submittedResult.memory =
            memory;


        await submittedResult.save();


        // Mark problem as solved if accepted
        if (
            status === 'accepted' &&
            !req.result.problemSolved.includes(problemId)
        ) {

            req.result.problemSolved.push(problemId);

            await req.result.save();
        }


        // Send response
        const accepted =
            status === 'accepted';


        res.status(201).json({

            accepted,

            totalTestCases:
                submittedResult.testCasesTotal,

            passedTestCases:
                testCasesPassed,

            runtime,

            memory,

            error:
                errorMessage
        });

    }

    catch (err) {

        console.error(
            "SUBMISSION ERROR:",
            err
        );

        res.status(500).json({
            accepted: false,
            error: err.message
        });
    }
};


const runCode = async(req,res)=>{
    
     // 
     try{
      const userId = req.result._id;
      const problemId = req.params.id;

      let {code,language} = req.body;

     if(!userId||!code||!problemId||!language)
       return res.status(400).send("Some field missing");

   //    Fetch the problem from database
      const problem =  await Problem.findById(problemId);
   //    testcases(Hidden)
      if(language==='cpp')
        language='c++'

   //    Judge0 code ko submit karna hai

   const languageId = getLanguageById(language);

   // Wrap the user's function in the problem's hidden driver code
   const sourceCode = buildSource(code, getDriverCode(problem, language));

   const submissions = problem.visibleTestCases.map((testcase)=>({
       source_code:sourceCode,
       language_id: languageId,
       stdin: testcase.input,
       expected_output: testcase.output
   }));


   const submitResult = await submitBatch(submissions);
   
   const resultToken = submitResult.map((value)=> value.token);

   const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = true;
    let errorMessage = null;

    for(const test of testResult){
        if(test.status_id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(test.time)
           memory = Math.max(memory,test.memory);
        }else{
          if(test.status_id==4){
            status = false
            errorMessage = test.stderr
          }
          else{
            status = false
            errorMessage = test.stderr
          }
        }
    }

   
  
   res.status(201).json({
    success:status,
    // Leave out source_code so the hidden driver code is not sent to the browser
    testCases: testResult.map(({ source_code, ...test }) => test),
    runtime,
    memory
   });
      
   }
   catch(err){
     res.status(500).send("Internal Server Error "+ err);
   }
}


module.exports = {submitCode,runCode};



//     language_id: 54,
//     stdin: '2 3',
//     expected_output: '5',
//     stdout: '5',
//     status_id: 3,
//     created_at: '2025-05-12T16:47:37.239Z',
//     finished_at: '2025-05-12T16:47:37.695Z',
//     time: '0.002',
//     memory: 904,
//     stderr: null,
//     token: '611405fa-4f31-44a6-99c8-6f407bc14e73',


// User.findByIdUpdate({
// })

//const user =  User.findById(id)
// user.firstName = "Mohit";
// await user.save();