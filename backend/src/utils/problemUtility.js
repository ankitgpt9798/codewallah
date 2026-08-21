const axios=require('axios');

const getLanguageById=(lang)=>{
     const language={
        "c++":54,
        "java":63,
        "javascript":64
     }
     return language[lang.toLowerCase()];
}

const submitBatch = async (submissions)=>{
const options = {
  method: 'POST',
  url: process.env.JUDGE0_BASE_URL,
  params: {
    base64_encoded: 'false'
  },
  headers: {
    "X-Auth-Token": process.env.JUDGE0_AUTH_TOKEN,
    "Content-Type": "application/json"
  },
  data: {
    submissions
  }
};
async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

 return await fetchData();
}
const waiting = (timer) => new Promise(resolve => setTimeout(resolve, timer));

const submitToken = async(resultToken)=>{
const options = {
  method: 'GET',
  url: process.env.JUDGE0_BASE_URL,
  params: {
    tokens: resultToken.join(","),
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
     "X-Auth-Token": process.env.JUDGE0_AUTH_TOKEN,
    "Content-Type": "application/json"

  }
};
async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}
 while(true){
 const result =  await fetchData();
  const IsResultObtained =  result.submissions.every((r)=>r.status_id>2);
  if(IsResultObtained)
    return result.submissions;
  await waiting(1000);
}
}


module.exports = {getLanguageById,submitBatch,submitToken};