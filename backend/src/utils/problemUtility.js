const axios = require('axios');

const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    "java": 62,
    "javascript": 63
  }
  return language[lang.toLowerCase()];
}


const judge0Client = axios.create({

  baseURL: process.env.JUDGE0_BASE_URL,
  timeout: 15000,
  headers: {
    "X-Auth-Token": process.env.JUDGE0_AUTH_TOKEN,
    "Content-Type": "application/json"
  }

});

const submitBatch = async (submissions) => {

  const response = await judge0Client.post(
    "/submissions/batch?base64_encoded=false",
    { submissions }
  );
  return response.data;

}
const waiting = (timer) => new Promise(resolve => setTimeout(resolve, timer));

const submitToken = async (resultToken) => {

  const tokenString = resultToken.join(",");

  while (true) {
    const { data } = await judge0Client.get(
      "/submissions/batch",
      {
        params: {
          tokens: tokenString,
          base64_encoded: 'false',
          fields: '*'
        }
      });

    const results = data.submissions;
    const IsResultObtained = results.every((r) => r.status_id > 2);
    if (IsResultObtained)
      return results;
    await waiting(1000);
  }
}


module.exports = { getLanguageById, submitBatch, submitToken };