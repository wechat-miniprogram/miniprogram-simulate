/**
 * 暂不考虑 context 和 node 实现
 */
class SelectorQuery {
  constructor() {
    this._commands = []
  }

  exec() {}

  in(compInst) {
    const realSelectorQuery = compInst.createSelectorQuery()
    if (this._commands.length) {
      this._commands.forEach(command => {
        const func = realSelectorQuery[command[0]]
        if (func) func.apply(realSelectorQuery, command[1])
      })
      this._commands = []
    }

    return realSelectorQuery
  }

  select(selector) {
    this._commands.push(['select', [selector]])
  }

  selectAll(selector) {
    this._commands.push(['selectAll', [selector]])
  }

  selectViewport() {
    this._commands.push(['selectViewport', []])
  }
}

module.exports = SelectorQuery
