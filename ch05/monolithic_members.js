const mysql = require('mysql');
const conn = {
    host: 'localhost',
    user: 'root',
    password: 'wowplus',
    database: 'monolithic'
};


/**
 * 회원 관리의 각 기능별로 분리
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
        case "DELETE":
            return unregister(method, pathname, params, (response) => {
                process.nextTick(cb, res, response);
            });
        default:
            return process.nextTick(cb, res, null); // 정의되지 않은 메서드라면 null 처리한다.
    }
}

/**
 * 회원 등록 기능
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
        dbcon.query("INSERT INTO members (id, username, password) VALUES (0, ?, ?)"
            , [params.username, params.password]
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
 * 회원 인증 기능
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
        dbcon.query("SELECT id FROM members WHERE username = '" + params.username + "' AND password = PASSWORD('" + params.password + "')", (error, results, fields) => {
            if (error || results.length == 0) {
                response.errorcode = 1;
                response.errormessage = error ? error : "no data";
            } else {
                response.userid = results[0].id;
            }

            cb(response);
        });
    }

    dbcon.end();
}

/**
 * 회원 탈퇴 기능
 * @param {*} method    메서드
 * @param {*} pathname  URI
 * @param {*} params    입력 파라메터
 * @param {*} cb        콜백 메서드
 */
function unregister(method, pathname, params, cb) {
    let response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };

    if (params.id == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        let dbcon = mysql.createConnection(conn);
        dbcon.connect();
        dbcon.query("DELETE FROM members WHERE username = '" + params.username + "' AND password = PASSWORD('" + params.password + "')"[params.id]
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