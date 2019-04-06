Component({
    data: {
        index: 1,
    },
    methods: {
        onCustomA(evt) {
            this.setData({
                index: evt.detail.index,
            })
        }
    }
})
