'use strict'

// 모노리식 서비스의 비즈니스 로직 참조
const biz = require('../ch05/monolithic_products.js');


// Server 클래스 참조
class products extends require('./server.js') 
{
    constructor() {
        super(
            "products", 
            process.argv[2] ? Number(process.argv[2]) : 9010,
            ["POST/products", "GET/products", "DELETE/products"]
        );

        // Distributor 연결
        this.connectToDistributor("127.0.0.1", 9000, (data) => {
            console.log("Distributor Notification", data);
        });
    }

    // Client 요청에 따른 비즈니스 로직 호출
    onRead(socket, data) {
        console.log("onRead", socket.remoteAddr, socket.remotePort, data);
        // 비즈니스 로직 호출
        biz.onRequest(socket, data.method, data.uri, data.params, (s, packet) => {
            socket.write(JSON.stringify(packet) + '¶');    // 응답 패킷 전송
        });
    }
}

new products();