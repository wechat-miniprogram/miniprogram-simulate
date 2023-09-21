const path = require('path')
const simulate = require('../../src')

function getDest(aa) {
  return simulate.trimHTML(`
        <view>head</view>
        <text>tmpl</text>
        <view>
            <text>7: I am msg</text>
            <text>Time: 12345</text>
        </view>
        <view>hello june</view>
        <view>
            <view>if</view>
            <view attr="I am attr value">node content</view>
            <comp>
                <view>
                    <text> I am comp</text>
                    <view>I am slot</view>
                </view>
            </comp>
            <view>1-item</view>
            <view>2-item</view>
            <view>3-item</view>
            <view>in block1</view>
            <text>in block2</text>
            <comp>
                <view>
                    <text>${aa} I am comp</text>
                </view>
            </comp>
        </view>
        <view>foot</view>
    `)
}

function runTest(id) {
  const comp = simulate.render(id)

  const parent = document.createElement('parent-wrapper')
  comp.attach(parent)

  expect(comp.innerHTML).toBe(getDest('haha'))

  comp.setData({
    aa: 'hehe',
  })
  expect(comp.innerHTML).toBe(getDest('hehe'))
  expect(comp.querySelector('#aa').instance.data.observerArr).toEqual(['hehe', 'haha'])
}

test('comp5', () => {
  const id = simulate.load(path.resolve(__dirname, './index'))

  runTest(id)
})
