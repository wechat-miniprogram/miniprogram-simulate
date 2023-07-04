class LogManager {
  debug() {}

  info() {}

  log() {}

  warn() {}
}

class RealtimeTagLogManager {
  addFilterMsg() {}

  error() {}

  info() {}

  setFilterMsg() {}

  warn() {}
}

class RealtimeLogManager {
  addFilterMsg() {}

  error() {}

  getCurrentState() {
    return {
      size: 1024,
      maxSize: 1024,
      logCount: 10,
      maxLogCount: 10,
    }
  }

  in() {}

  info() {}

  setFilterMsg() {}

  tag() {
    return new RealtimeTagLogManager()
  }

  warn() {}
}

module.exports = {
  LogManager,
  RealtimeLogManager,
}
