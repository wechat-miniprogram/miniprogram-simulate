class NetworkTask {
  abort() {
    if (this._timer) this._timer = clearTimeout(this._timer)
  }

  offChunkReceived() {}

  offHeadersReceived() {}

  onChunkReceived() {}

  onHeadersReceived() {}
}

class RequestTask extends NetworkTask {
  constructor(options = {}) {
    super()
    const res = {
      errMsg: 'request:ok',
      data: {},
      statusCode: 200,
      header: {},
      cookies: [],
      profile: {},
    }
    this._timer = setTimeout(() => {
      if (typeof options.success === 'function') options.success(res)
      if (typeof options.complete === 'function') options.complete(res)
    }, 100)
  }
}

class DownloadTask extends NetworkTask {
  constructor(options = {}) {
    super()
    const res = {
      errMsg: 'downloadFile:ok',
      tempFilePath: '/',
      filePath: '/',
      statusCode: 200,
      profile: {},
    }
    this._timer = setTimeout(() => {
      if (typeof options.success === 'function') options.success(res)
      if (typeof options.complete === 'function') options.complete(res)
    }, 100)
  }
}

class UploadTask extends NetworkTask {
  constructor(options = {}) {
    super()
    const res = {
      errMsg: 'uploadFile:ok',
      data: {},
      statusCode: 200,
    }
    this._timer = setTimeout(() => {
      if (typeof options.success === 'function') options.success(res)
      if (typeof options.complete === 'function') options.complete(res)
    }, 100)
  }
}

class SocketTask {
  constructor(options = {}) {
    const res = {
      errMsg: 'connectSocket:ok',
    }
    this._timer = setTimeout(() => {
      if (typeof options.success === 'function') options.success(res)
      if (typeof options.complete === 'function') options.complete(res)
    }, 100)
  }

  send() {}

  close() {}

  onOpen() {}

  onClose() {}

  onError() {}

  onMessage() {}
}

class Socket {
  connect() {}

  write() {}

  close() {}

  onClose() {}

  offClose() {}

  onError() {}

  offError() {}

  onMessage() {}

  offMessage() {}
}

class TCPSocket extends Socket {
  bindWifi() {}

  onConnect() {}

  offConnect() {}

  onBindWifi() {}

  offBindWifi() {}
}

class UDPSocket extends Socket {
  bind(port) {
    return port || 888
  }

  setTTL() {}

  send() {}

  onListening() {}

  offListening() {}
}

module.exports = {
  RequestTask,
  DownloadTask,
  UploadTask,
  SocketTask,
  TCPSocket,
  UDPSocket,
}
