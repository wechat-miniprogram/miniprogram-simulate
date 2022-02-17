Component({
    properties: {
        aa: {
            type: String,
            value: '',
            observer(newVal, oldVal) {
                this.setData({
                    observerArr: [newVal, oldVal],
                })
            },
        },
    },
})
