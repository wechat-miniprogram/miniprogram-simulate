Component({
  properties: {
    prop: {
      type: String,
      value: 'index.properties',
      observer(newVal, oldVal) {
        this.setData({
            observerArr: [newVal, oldVal],
        })
      }
    },
  },
})
