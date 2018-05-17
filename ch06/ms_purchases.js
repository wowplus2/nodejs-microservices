'use strict';

const biz = require('../ch05/monolithic_purchases.js');

class purchases extends require('./server.js')
{
    constructor() {
        super(
            "purchases",
            process.argv[2] ? Number(process.argv[2]) : 9030,
            ["POST/purchases", "GET/purchases"]
        );

        this.connectToDistributor("127.0.0.1", 9000, (data) => {
            console.log("Distribtor Notification", data);
        });
    }

    onRead(socket, data) {
        console.log("onRead", socket.remoteAddr, socket.remotePort, data);
        biz.onRequest(socket, data.method, data.uri, data.params, (s, packet) => {
            socket.write(JSON.stringify(packet) + '¶');
        });
    }
}

new purchases();