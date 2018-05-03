function func(cb) {
    process.nextTick(cb, "callback!!");
}

try {
    func((param) => {
        a.a = 0
    });
} catch (e) {
    console.log("exception!!");
}

process.on("uncaughtException", (error) => {    // 모든 쓰레드에서 발생하는 예외 처리
    console.log("uncaughtException!!")
});