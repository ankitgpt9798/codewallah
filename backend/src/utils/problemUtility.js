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
    base64_encoded: 'true'
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

module.exports = {getLanguageById,submitBatch};