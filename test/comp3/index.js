const behavior = require('./behavior')

Component({
  properties: {
    prop: {
      type: String,
      value: 'index.properties'
    },
  },
  behaviors: [behavior],
})
