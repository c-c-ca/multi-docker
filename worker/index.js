const { redisHost, redisPort } = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
    host: redisHost,
    port: redisPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

// function fib(index) {
//     let prev = 0, curr = 1;

//     for (let i = 0; i < index; i++) {
//         [prev, curr] = [curr, prev + curr];
//     }

//     return curr;
// }

function fib(index) {
    return index < 2 ? 1 : fib(index - 1) + fib(index - 2);
}

sub.on("message", (channel, message) => {
    redisClient.hset("values", message, fib(parseInt(message)));
});

sub.subscribe("insert");