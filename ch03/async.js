function func (cb) {
  // 1. func함수 선언
  cb('callback!!') // 2. 인자값으로 전달된 callback 함수 호출
}

func(param => {
  // 3. 익명함수를 인자로 func 함수 호출
  console.log(param)
})
