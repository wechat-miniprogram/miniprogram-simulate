Component({
  relations: {
    './custom-ul': {
      type: 'parent',
      linked(target) {
        console.log('child linked to ', target)
      },
      linkChanged(target) {
        
      },
      unlinked(target) {

      },
    },
  },
})
