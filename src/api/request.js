module.exports = {
    request(options = {}) {
        const DEFAULT_HEADERS = {
            'Access-Control-Allow-Headers': "x-requested-with",
            'Access-Control-Allow-Methods': "POST, GET, OPTIONS, DELETE",
            'Access-Control-Allow-Origin': "*",
            'Access-Control-Max-Age': "3600",
            'Connection':"keep-alive",
            'Content-Type':"application/json;charset=utf-8",
            'Date': "Tue, 24 Sep 2019 10:01:30 GMT",
            'Server': "nginx",
            'Transfer-Encoding': "chunked"
        }

        class Request {
            constructor (options) {
                this.isAbort = false;
                this._onHeadersReceivedFun = null;
                this._options = options;
            }
            _complete () {
                let _headers = Object.assign({},DEFAULT_HEADERS, options.header);
                let _datas = Object.assign({}, options.data);
                let _statusCode = Number(options.statusCode) || 200;
                if(this.isAbort) return;
                if(_statusCode === 200 && options.success && typeof options.success === 'function'){
                    options.success({
                        cookies: [],
                        data: {
                            code: 200,
                            msg: 'success',
                            data: _datas
                        },
                        errMsg: 'request: ok',
                        header: _headers,
                        statusCode: 200
                    });
                }else if(options.fail && typeof options.fail === 'function'){
                    options.fail({
                        cookies: [],
                        data: {
                            code: _statusCode,
                            msg: 'fail',
                            data: _datas
                        },
                        errMsg: 'request: fail',
                        header: _headers,
                        statusCode: 200
                    });
                }
                if(options.complete && typeof options.complete === 'function'){
                    options.complete({
                        cookies: [],
                        data: {
                            code: _statusCode,
                            msg: 'success',
                            data: _datas
                        },
                        errMsg: 'request: ok',
                        header: _headers,
                        statusCode: _statusCode
                    });
                }
                if(this._onHeadersReceivedFun && typeof this._onHeadersReceivedFun === 'function'){
                    this._onHeadersReceivedFun(_headers);
                }
            }
            abort () {
                this.isAbort = true;
            }
            offHeadersReceived () {
                this.isOnHeadersReceived = false;
                this._onHeadersReceivedFun = null;
            }
            onHeadersReceived (fun) {
                if(fun && typeof this.fun === 'function');
                this._onHeadersReceivedFun = fun;
            }
        };
        const _request = new Request(options);
        setTimeout(function(){
            _request._complete();
        }, 1000);
        return _request;
    }
}
