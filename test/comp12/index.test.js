const path = require('path')
const simulate = require('../../index')

function runTest(id) {
  const comp = simulate.render(id)

  const parent = document.createElement('parent-wrapper')
  comp.attach(parent)

  // 嵌套的自定义组件需要渲染出自身模板，而不是停留在空节点
  expect(simulate.match(comp.dom, `
        <wx-view class="page--page">
            <main-status>
                <wx-view class="main-status--main--status">
                    <u-icon>
                        <wx-view class="u-icon--u-icon">[star]</wx-view>
                    </u-icon>
                    <wx-view class="main-status--main--msg">这是测试文案</wx-view>
                </wx-view>
            </main-status>
        </wx-view>
    `)).toBe(true)
  expect(comp.dom.querySelector('main-status').innerHTML).toBeTruthy()
  expect(comp.dom.querySelector('u-icon').innerHTML).toBeTruthy()
}

test('comp12', () => {
  let id = simulate.load(path.resolve(__dirname, './page/index'), 'page')
  runTest(id)

  jest.resetModules() // https://github.com/facebook/jest/issues/5120

  id = simulate.load(path.resolve(__dirname, './page/index'), 'page', {compiler: 'simulate'})
  runTest(id)
})
