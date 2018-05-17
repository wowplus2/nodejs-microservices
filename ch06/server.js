'use strict';

const net = require('net');
const tcpClient = require('./client.js');


class tcpServer 
{
    constructor(name, port, urls) {
        this.context = {
            port: port,
            name: name,
            urls: urls
        }

        this.merge = {};

        this.server = net.createConnection((socket) => {  // 서버 생성
            this.onCreate(socket);    // 클라이언트 접속 이벤트 처리

            socket.on('error', (exception) => {   // 이벤트 에러 처리
                this.onClose(socket);
            });

            socket.on('close', () => {    // 클라이언트 접속 종료 이벤트 처리
                this.onClose(socket);
            });

            socket.on('data', (data) => {     // 데이터 수신 처리
                let key = socket.remoteAddress + ":" + socket.remotePort;
                let sz = this.merge[key] ? this.merge[key] + data.toString() : data.toString();
                let arr = sz.split('¶');

                for (let i in arr) {
                    if (sz.charAt(sz.length - 1) != '¶' && i == arr.length - 1) {
                        this.merge[key] = arr[i];
                        break;
                    } else if (arr[i] == "") {
                        break;
                    } else {
                        this.onRead(socket, JSON.parse(arr[i]));
                    }
                }
            });
        });

        this.server.on('error', (err) => {  // 서버 객체 에러 처리
            console.log(err);
        });

        this.server.listen(port, () => {
            console.log('listen', this.server.address());
        });
    }

    onCreate(socket) {
        console.log("onCreate", socket.remoteAddress, socket.remotePort);
    }

    onClose(socket) {
        console.log("onClose", socket.remoteAddress, socket.remotePort);
    }

    connectToDistributor(host, port, onNoti) {  // Distributor 접속 함수
        // Distributor에 전달할 패킷 정의
        let packet = { 
            uri: "/distributes",
            method: "POST",
            key: 0,
            params: this.context
        };

        let isConnectedDistributor = false; // Distributor 접속 상태

        this.clientDistributor = new tcpClient(
            host,
            port,
            (options) => {  // 접속 이벤트
                isConnectedDistributor = true;
                this.clientDistributor.write(packet);
            },
            (options, data) => { onNoti(data); },               // 데이터 수신 이벤트
            (options) => { isConnectedDistributor = false; },   // 접속 종료 이벤트
            (options) => { isConnectedDistributor = false }     // 에러 이벤트
        );

        // 주기적(3초 간격)으로 Distributor 접속 시도
        setInterval(() => {
            if (isConnectedDistributor != true) {
                this.clientDistributor.connect();
            }
        }, 3000);
    }
}

module.exports = tcpServer;