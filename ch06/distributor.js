'use strict'

// 접속 노드 관리 Object
let map = {};

// Server 클래스 상속
class distributor extends require('./server.js')
{
    constructor() {
        super("distributor", 9000, ["POST/distributes", "GET/distributes"]);
    }

    // 노드 접속 이벤트 처리
    onCreate(socket) {
        console.log("onCreate", socket.remoteAddr, socket.remotePort);
        this.sendInfo(socket);
    }

    // 노드 접속 해제 이벤트 처리
    onClose(socket) {
        let k = socket.remoteAddr + ":" + socket.remotePort;
        console.log("onClose", socket.remoteAddr, socket.remotePort);
        
        delete map[k];
        this.sendInfo();
    }

    // 노드 등록(수신) 이벤트 처리
    onRead(socket, json) {
        let k = socket.remoteAddr + ":" + socket.remotePort;
        console.log("onRead", socket.remoteAddr, socket.remotePort, json);

        // 노드 정보 등록
        if (json.uri == "/distributes" && json.method == "POST") {
            map[k] = {
                socket: socket
            };

            map[k].info = json.params;
            map[k].info.host = socket.remoteAddr;

            // 접속한 노드에 전파
            this.sendInfo();
        }
    }

    // 패킷 전송
    write(socket, packet) {
        socket.write(JSON.stringify(packet) + '¶');
    }

    // 접속 노드 혹은 특정 소켓에 접속 노드 정보 전파
    sendInfo(socket) {
        let packet = {
            uri: "/distributes",
            method: "GET",
            key: 0,
            params: []
        };

        for (let k in map) {
            packet.params.push(map[k].info);
        }

        if (socket) {
            this.write(socket, packet);
        } else {
            for (let i in map) {
                this.write(map[i].socket, packet);
            }
        }
    }
}

// distributor 객체 생성
new distributor();