Component({
    properties: {
        hasChild: {
            type: Boolean,
            value: false,
        },
        prop: {
            type: String,
            value: 'index.properties',
            observer(newVal, oldVal) {
                this.setData({
                    'observerArr[0]': newVal,
                    'observerArr[1]': oldVal,
                })
            }
        },
    },
    data: {
        observerArr: [],
    },
    observers: {
        prop(value) {
            this.setData({
                'observerArr[2]': value,
                'observerArr[3]': this.getStr(),
            })
        },
    },
    methods: {
        getStr() {
            return 'observers'
        }
    },
    pageLifetimes: {
        show(args) {
            this.setData({
                'observerArr[4]': 'pageShow',
                'observerArr[5]': args,
            })
        },
    },
})
