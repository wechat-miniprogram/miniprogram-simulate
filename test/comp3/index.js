const behavior = require('./behavior')

Component({
    properties: {
        prop: {
            type: String,
            value: 'index.properties'
        },
    },
    data: {
        a: 123,
    },
    behaviors: [behavior],
    methods: {
        print() {
            return this.data.a
        },
    },
})
