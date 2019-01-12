const b = require('./b')

module.exports = function() {
    return 'a' + b()
}
