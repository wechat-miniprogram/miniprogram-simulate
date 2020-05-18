const prettyFormat = require('pretty-format')
const snapshotPlugin = require('../../src/jest-snapshot-plugin')

const testSymbol =
  typeof Symbol === 'function' && Symbol.for
      ? Symbol.for('j-component.json')
      : 0xd846fe

test('snapshot', () => {
    const str = prettyFormat(
        {
            $$typeof: testSymbol,
            tagName: 'view',
            attrs: [{name: 'class', value: 'weui'}],
            event: {
                tap: {
                    handler: 'onTap',
                    id: 0,
                    isCapture: true,
                    isCatch: false,
                    isMutated: true,
                    name: 'tap',
                },
            },
            children: [
                'hello ',
                {
                    $$typeof: testSymbol,
                    tagName: 'view',
                    attrs: [],
                    event: {},
                    children: [],
                },
            ],
        },
        {plugins: [snapshotPlugin]}
    )
    expect(str).toEqual(
        '<view\n  class="weui"\n  capture-mut-bind:tap="onTap"\n>\n  hello \n  <view />\n</view>'
    )
})
