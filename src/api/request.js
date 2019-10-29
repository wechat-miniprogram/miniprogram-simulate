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

        function request (options) {
            const self = this;
            this.isAbort = false;
            this._onHeadersReceivedFun = null;
            let _headers = Object.assign({},DEFAULT_HEADERS, options.header);
            setTimeout(function(){
                if(self.isAbort) return;
                if(options.success && typeof options.success === 'function'){
                    options.success({
                        cookies: [],
                        data: {
                            code: 200,
                            msg: 'success',
                            data: {}
                        },
                        errMsg: 'request: ok',
                        header: _headers,
                        statusCode: 200
                    });
                }
                if(options.complete && typeof options.complete === 'function'){
                    options.complete({
                        cookies: [],
                        data: {
                            code: 200,
                            msg: 'success',
                            data: {}
                        },
                        errMsg: 'request: ok',
                        header: _headers,
                        statusCode: 200
                    });
                }
                if(this._onHeadersReceivedFun && typeof this._onHeadersReceivedFun === 'function'){
                    options.onHeadersReceived();
                }
            }, 1000);
        };
        request.prototype.abort = function() {
            this.isAbort = true;
        };
        request.prototype.offHeadersReceived = function() {
            this.isOnHeadersReceived = false;
            this._onHeadersReceivedFun = null;
        };
        request.prototype.onHeadersReceived = function(fun) {
            if(fun && this.fun === 'function');
            this._onHeadersReceivedFun = fun;
        };
        return new request(options);
    }
}
