Component({
    methods: {
        triggerSome(data) {
            this.triggerEvent('customa', {
                index: data,
            })
        }
    }
})
