const net = require('net')

let opts = {
  // 접속 정보 설정
  port: 3000,
  host: '127.0.0.1'
}

let client = net.connect(opts, () => {
  // 서버접속
  console.log('connected...')
})

client.on('data', data => {
  // 데이터 수신 이벤트
  console.log(data.toString())
})

client.on('end', () => {
  // 접속 종료 이벤트
  console.log('disconnected...')
})
