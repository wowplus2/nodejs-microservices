'use strict';

// 비즈니스로직 - 파일참조
const biz = require('../ch05/monolithic_members.js');

// Server 클래스 참조
class members extends require('./server.js')
{
    constructor() {
        // 부모 클래스 생성자 호출
        super(
            "members",
            process.argv[2] ? Number(process.argv[2]) : 9020,
            ["POST/members", "GET/members", "DELETE/members"]
        );
        // Distributor 연결
        this.connectToDistributor("127.0.0.1", 9000, (data) => {
            console.log("Distributor Notification", data);
        });
    }

    // 클라이언트 요청에 따른 비즈니스로직 호출
    onRead(socket, data) {
        console.log("onRead", socket.remoteAddr, socket.remotePort, data);
        biz.onRequest(socket, data.method, data.uri, data.params, (s, packet) => {
            socket.write(JSON.stringify(packet) + '¶');
        });
    }
}

// 인스턴스 생성
new members();