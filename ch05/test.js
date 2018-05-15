const http = require('http');

let opts = {
    host: "127.0.0.1",
    port: 3000,
    headers: {
        'Content-Type': 'application/json',
    }
};

function request(cb, params) {
    let req = http.request(opts, (res) => {
        let data = "";
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log(opts, data);
            cb();   // cb: 통신완료 후 콜백을 알려준다.
        });
    });

    if (params) {
        req.write(JSON.stringify(params));  // POST, PUT이면 스트링 형식으로 전송
    }

    req.end();
}

/**
 * 상품관리 API 테스트
 * @param {*} callback  콜백 메서드 
 */
function products(callback) {

    products_post(() => {
        products_get(() => {
            products_delete(callback);
        });
    });

    function products_post(cb) {
        opts.method = "POST";
        opts.path = "/products";
        request(cb, {
            name: "test Goods",
            category: "tests",
            price: 1000,
            description: "test"
        });
    }

    function products_get(cb) {
        opts.method = "GET";
        opts.path = "/products";
        request(cb);
    }

    function products_delete(cb) {
        opts.method = "DELETE";
        opts.path = "/products?id=1";
        request(cb);
    }
}

/**
 * 회원 관리 API 테스트
 * @param {*} callback  콜백 메서드 
 */
function members(callback) {

    members_delete(() => {
        members_post(() => {
            members_get(callback);
        });
    });

    function members_post(cb) {
        opts.method = "POST";
        opts.path = "/members";
        request(cb, {
            username: "test_account",
            password: "1234",
            passwordConfirm: "1234"
        });
    }

    function members_delete(cb) {
        opts.method = "DELETE";
        opts.path = "/members?username=test_account";
        request(cb);
    }
}

/**
 * 구매 관리 API 테스트
 * @param {*} callback 
 */
function purchases(callback) {

    purchases_post(() => {
        purchases_get(() => {
            callback();
        });
    });

    function purchases_post(cb) {
        opts.method = "POST";
        opts.path = "/purchases";
        request(cb, {
            userid: 1,
            goodsid: 1
        });
    }

    function purchases_get(cb) {
        opts.method = "GET";
        opts.path = "/purchases?userid=1";
        request(cb);
    }
}

console.log("============================== members ==============================");
members(() => {
    console.log("============================== products ==============================");
    products(() => {
        console.log("============================== purchases ==============================");
        purchases(() => {
            console.log("done");
        });
    });
});