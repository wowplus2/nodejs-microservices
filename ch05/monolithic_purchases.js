const mysql = require('mysql');
const conn = {
    host: 'localhost',
    user: 'root',
    password: 'wowplus',
    database: 'monolithic'
};


/**
 * 구매 관리의 각 기능별로 분기
 * @param {*} res       response 객체
 * @param {*} method    메서드
 * @param {*} pathname  URI
 * @param {*} params    입력 파라메터
 * @param {*} cb        콜백 메서드
 */
exports.onRequest = (res, method, pathname, params, cb) => {
    switch (method) {
        case "POST":
            return register(method, pathname, params, (response) => {
                process.nextTick(cb, res, response);
            });
        case "GET":
            return inquiry(method, pathname, params, (response) => {
                process.nextTick(cb, res, response);
            });
        default:
            return process.nextTick(cb, res, null); // 정의되지 않은 메서드라면 null 처리한다.
    }
}

/**
 * 구매 기능
 * @param {*} method    메서드
 * @param {*} pathname  URI
 * @param {*} params    입력 파라메터
 * @param {*} cb        콜백 메서드
 */
function register(method, pathname, params, cb) {
    let response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };

    if (params.username == null || params.password == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Paramters";
        cb(response);
    } else {
        let dbcon = mysql.createConnection(conn);
        dbcon.connect();
        dbcon.query("INSERT INTO purchases (userid, goodsid) VALUES (?, ?)"
            , [params.userid, params.goodsid]
            , (error, results, fields) => {
                if (error) {
                    response.errorcode = 1;
                    response.errormessage = error;
                }

                cb(response);
            }
        );

        dbcon.end();
    }
}

/**
 * 구매내역 조회 기능
 * @param {*} method    메서드
 * @param {*} pathname  URI
 * @param {*} params    입력 파라메터
 * @param {*} cb        콜백 메서드
 */
function inquiry(method, pathname, params, cb) {
    let response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };

    if (params.username == null || params.password == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Paramters";
        cb(response);
    } else {
        let dbcon = mysql.createConnection(conn);
        dbcon.connect();
        dbcon.query("SELECT id, goodsid, date FROM purchases WHERE userid = ?"
            , [params.userid]
            , (error, results, fields) => {
                if (error) {
                    response.errorcode = 1;
                    response.errormessage = error;
                } else {
                    response.results = results;
                }

                cb(response);
            }
        );

        dbcon.end();
    }
}
