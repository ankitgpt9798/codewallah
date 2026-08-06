const {createClient}=require('redis');

const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'mice-blue-addition-72457.db.redis.io',
        port: 15308
    }
});