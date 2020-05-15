// path/to/custom-ul.js
Component({
  relations: {
    './custom-li': {
      type: 'child',
      linked(target) {
        console.log('[custom-ul] a child is linked: ', target)
      },
      linkChanged(target) {

      },
      unlinked(target) {

      },
    },
  },
  methods: {
    getAllLi() {
      var nodes = this.getRelationNodes('./custom-li-component')
      console.log(nodes)
    }
  },
})