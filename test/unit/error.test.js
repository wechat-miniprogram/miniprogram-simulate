const path = require('path')
const simulate = require('../../index')

const errorHint = '  Please check the path, or pass the correct rootPath to simulate.load() if the component lives elsewhere.'

function catchError(fn) {
  try {
    fn()
  } catch (err) {
    return err
  }

  return null
}

test('error', () => {
  let catchErr = null
  try {
    simulate.load(123)
  } catch (err) {
    catchErr = err
  }
  expect(catchErr.message).toBe('componentPath must be a string')

  catchErr = null
  try {
    simulate.load('./index')
  } catch (err) {
    catchErr = err
  }
  expect(catchErr.message).toBe('invalid componentPath: ./index')

  catchErr = null
  try {
    simulate.behavior('./index')
  } catch (err) {
    catchErr = err
  }
  expect(catchErr.message).toBe('definition must be a object')

  catchErr = null
  try {
    simulate.render()
  } catch (err) {
    catchErr = err
  }
  expect(catchErr.message).toBe('you need to pass the componentId')

  expect(simulate.render(123)).toBe(undefined)
  expect(simulate.match(null)).toBe(false)

  catchErr = null
  try {
    simulate.scroll()
  } catch (err) {
    catchErr = err
  }
  expect(catchErr.message).toBe('invalid params')
})

test('usingComponents not found', () => {
  const compPath = path.resolve(__dirname, '../comp3/index')

  // 绝对路径在 rootPath 下找不到时直接报错，并提示实际查找的路径
  const absErr = catchError(() => simulate.load(compPath, 'custom-comp', {
    usingComponents: {'u-icon': '/components/u-icon/index'},
  }))
  expect(absErr).not.toBe(null)
  expect(absErr.message).toBe([
    `invalid usingComponents["u-icon"] in ${compPath}.json: "/components/u-icon/index"`,
    `  resolved to ${path.join(path.dirname(compPath), '/components/u-icon/index')}, but the file does not exist.`,
    errorHint,
  ].join('\n'))

  // 组件 json 中声明的相对路径找不到时同样报错
  const notExistCompPath = path.resolve(__dirname, '../comp-error/index')
  const relativeErr = catchError(() => simulate.load(notExistCompPath, 'custom-comp'))
  expect(relativeErr).not.toBe(null)
  expect(relativeErr.message).toBe([
    `invalid usingComponents["not-exist"] in ${notExistCompPath}.json: "./not-exist"`,
    `  resolved to ${path.join(path.dirname(notExistCompPath), './not-exist')}, but the file does not exist.`,
    errorHint,
  ].join('\n'))

  // options.usingComponents 中的相对路径缺失时保持原有行为，不报错
  const overrideErr = catchError(() => simulate.load(compPath, 'custom-comp', {
    usingComponents: {'not-exist': './not-exist'},
  }))
  expect(overrideErr).toBe(null)
})
