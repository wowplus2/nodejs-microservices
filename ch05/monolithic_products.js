const mysql = require('mysql');
const conn = {
    host: 'localhost',
    user: 'root',
    password: 'wowplus',
    database: 'monolithic'
};


/**
 * 상품 관리의 각 기능별로 분리
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
 * 상품 등록 기능
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

    if (params.name == null || params.category == null || params.price == null || params.description == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Paramters";
        cb(response);
    } else {
        let dbcon = mysql.createConnection(conn);
        dbcon.connect();
        dbcon.query("INSERT INTO goods (name, category, price, description) VALUES (?, ?, ?, ?)"
            , [params.name, params.category, params.price, params.description]
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
 * 상품 조회 기능
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

    let dbcon = mysql.createConnection(conn);
    dbcon.connect();
    dbcon.query("SELECT * FROM goods", (error, results, fields) => {
        if (error || results.length == 0) {
            response.errorcode = 1;
            response.errormessage = error ? error : "no data";
        } else {
            response.results = results;
        }

        cb(response);
    });

    dbcon.end();
}

/**
 * 상품 삭제 기능
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
        dbcon.query("DELETE FROM goods WHERE id = ?"
            , [params.id]
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