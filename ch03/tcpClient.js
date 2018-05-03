const net = require('net');

let opts = {
    port: 4000,
    host: "127.0.0.1"
}

let client = net.connect(opts, () => {
    console.log("connected");
});

client.on('data', (data) => {
    console.log(data.toString())
});

client.on('end', () => {
    console.log("disconnected...");
});