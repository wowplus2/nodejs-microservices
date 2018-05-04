const http = require('http')

let opts = {
  // 호출페이지 정보 설정
  host: '127.0.0.1',
  port: 3000,
  path: '/'
}

let req = http.request(opts, res => {
  // 페이지 호출
  let data = ''
  res.on('data', chunk => {
    // 서버가 보내는 데이터 수신
    data += chunk
  })

  res.on('end', () => {
    // 수신 완료시 화면에 출력
    console.log(data)
  })
})

req.end() // 명시적 완료
