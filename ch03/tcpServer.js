const net = require('net') // net 모듈 로드

let server = net.createServer(sock => {
  // TCP 서버 생성
  sock.end('hello world') // 접속시 hello world 응답
})

server.on('error', err => {
  // 네트워크 에러 처리
  console.log(err)
})

server.listen(3000, () => {
  // 3000번 포트로 리슨
  console.log('listen', server.address()) // 리슨이 가능해지면 화면에 출력
})
