// Adds the problems from problems.js through the running backend's /problem/create API,
// so every reference solution is validated on Judge0 before it is saved.
// Problems whose title already exists are updated through /problem/update/:id.
//
// Usage (from the backend folder, with the server running):
//   node scripts/seedProblems.js
//
// Needs ADMIN_EMAIL and ADMIN_PASSWORD (or ADMIN_PASS) for an admin account in backend/.env.

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const axios = require('axios');
const problems = require('./problems');

const BASE_URL = process.env.SEED_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

const errorMessage = (err) => {
    const data = err.response?.data;
    if (data?.message) return data.message;
    if (typeof data === 'string') return data;
    return err.message;
};

const main = async () => {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env first.");
        process.exit(1);
    }

    // Log in and reuse the auth cookie for the following requests
    const loginRes = await axios.post(`${BASE_URL}/user/login`, {
        emailId: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
    });
    if (loginRes.data.user?.role !== 'admin') {
        console.error(`${ADMIN_EMAIL} is not an admin account.`);
        process.exit(1);
    }
    const cookie = loginRes.headers['set-cookie'].map((c) => c.split(';')[0]).join('; ');
    const client = axios.create({ baseURL: BASE_URL, headers: { Cookie: cookie } });

    // Problems that already exist (matched by title) are updated instead of created.
    // getAllProblem returns 404 when there are none.
    const existingIds = new Map();
    try {
        const { data } = await client.get('/problem/getAllProblem');
        for (const p of data) existingIds.set(p.title, p._id);
    } catch (err) {
        if (err.response?.status !== 404) throw err;
    }

    let created = 0, updated = 0, failed = 0;
    for (const problem of problems) {
        const id = existingIds.get(problem.title);
        try {
            if (id) {
                await client.put(`/problem/update/${id}`, problem);
                console.log(`UPDATED  ${problem.title}`);
                updated++;
            } else {
                await client.post('/problem/create', problem);
                console.log(`CREATED  ${problem.title}`);
                created++;
            }
        } catch (err) {
            console.log(`FAILED   ${problem.title}\n${errorMessage(err)}`);
            failed++;
        }
    }

    console.log(`\nDone: ${created} created, ${updated} updated, ${failed} failed.`);
    if (failed) process.exit(1);
};

main().catch((err) => {
    console.error("Error:", errorMessage(err));
    process.exit(1);
});
