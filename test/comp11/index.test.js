const path = require('path')
const simulate = require('../../dist/miniprogram_simulate.cjs.js')

test('comp11', () => {
  const comp2Id = simulate.loadComponent(
    path.resolve(__dirname, './comp/comp2'),
    'comp2',
    {
      rootPath: __dirname,
    }
  )
  const id = simulate.loadComponent(path.resolve(__dirname, './index'), 'custom-comp', {
    usingComponents: {
      comp1: './comp/comp1',
      comp2: comp2Id,
    },
    rootPath: __dirname,
  })
  const comp = simulate.render(id, {prop: 'index.test.properties'})

  const parent = document.createElement('parent-wrapper')
  comp.attach(parent)

  expect(comp.innerHTML).toBe(
    simulate.trimHTML(`
      <view>root</view>
      <comp1 class="custom-comp--comp1">
          <view class="comp1--index">from root</view>
          <comp2 class="comp1--comp2">
              <view class="comp2--index">from comp1</view>
          </comp2>
      </comp1>
  `)
  )
  expect(comp.querySelector('.comp1').instance.getStr).toBeInstanceOf(Function)
  expect(comp.querySelector('.comp1').instance.getStr()).toBe('comp1')
  expect(
    comp.querySelector('.comp1').querySelector('.comp2').instance.getStr
  ).toBeInstanceOf(Function)
  expect(
    comp.querySelector('.comp1').querySelector('.comp2').instance.getStr()
  ).toBe('comp2')
  expect(comp.dom.tagName).toBe('CUSTOM-COMP')
})
