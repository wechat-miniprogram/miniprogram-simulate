const simulate = require('../../dist/miniprogram_simulate.cjs.js')

test('snapshot', () => {
  const id = simulate.loadComponentByDef(
    {},
    `
      <abc class="index" bind:tap="onTap">{{prop}}</abc>
      <div class="index">
          <div class="inner">321</div>
      </div>
    `,
    {
      properties: {
        prop: {
          type: String,
          value: 'index.properties',
        },
      },
      data: {
        a: 123,
      },
      methods: {
        onTap() {
          this.setData({
            prop: 'tap',
          })
        },
      },
    }
  )
  const comp = simulate.render(id)
  comp.attach(document.body)
  expect(comp).toMatchSnapshot()
  comp.querySelector('.index').dispatchTapEvent()
  expect(comp).toMatchSnapshot()
  comp.detach()
})
