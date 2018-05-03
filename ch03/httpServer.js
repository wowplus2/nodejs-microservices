const http = require('http');                   // http 모듈 로드

let server = http.createServer((req, res) => {  // createServer 함수를 이용한 인스턴스 생성
    res.end("hello world");                     // hello world 응답
});

server.listen(3000);                            // 300번 서비스 포트로 리슨