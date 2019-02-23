const path = require('path')
const simulate = require('../../index')

test('comp5', () => {
    const id = simulate.load(path.resolve(__dirname, './index'))
    const comp = simulate.render(id)

    const parent = document.createElement('parent-wrapper')
    comp.attach(parent)

    expect(simulate.match(comp.dom, `
        <wx-view>head</wx-view>
        <wx-text>tmpl</wx-text>
        <wx-view>
            <wx-text>7: I am msg</wx-text>
            <wx-text>Time: 12345</wx-text>
        </wx-view>
        <wx-view>hello june</wx-view>
        <wx-view>
            <wx-view>if</wx-view>
            <wx-view>node content</wx-view>
            <comp>
                <wx-view>
                    <wx-text> I am comp</wx-text>
                    <wx-view>I am slot</wx-view>
                </wx-view>
            </comp>
            <wx-view>1-item</wx-view>
            <wx-view>2-item</wx-view>
            <wx-view>3-item</wx-view>
            <wx-view>in block1</wx-view>
            <wx-text>in block2</wx-text>
        </wx-view>
        <wx-view>foot</wx-view>
    `)).toBe(true)
})


    const d =  {
        "tag": "wx-page",
        "children": [
            {
                "tag": "wx-view",
                "attr": {},
                "children": [
                    "head"
                ],
                "n": [],
                "raw": {},
                "generics": {}
            },
            {
                "tag": "virtual",
                "children": [
                    {
                        "tag": "wx-text",
                        "attr": {},
                        "children": [
                            "tmpl"
                        ],
                        "n": [],
                        "raw": {},
                        "generics": {}
                    }
                ],
                "wxXCkey": 3,
                "wxVkey": "tmpl.wxml:tmpl"
            },
            {
                "tag": "virtual",
                "children": [
                    {
                        "tag": "wx-view",
                        "attr": {},
                        "children": [
                            {
                                "tag": "wx-text",
                                "attr": {},
                                "children": [
                                    "7: I am msg"
                                ],
                                "n": [],
                                "raw": {},
                                "generics": {}
                            },
                            {
                                "tag": "wx-text",
                                "attr": {},
                                "children": [
                                    "Time: 12345"
                                ],
                                "n": [],
                                "raw": {},
                                "generics": {}
                            }
                        ],
                        "n": [],
                        "raw": {},
                        "generics": {}
                    }
                ],
                "wxXCkey": 3,
                "wxVkey": "index.wxml:msgItem"
            },
            {
                "tag": "wx-view",
                "attr": {},
                "children": [
                    "hello june"
                ],
                "n": [],
                "raw": {},
                "generics": {}
            },
            {
                "tag": "wx-view",
                "attr": {},
                "children": [
                    {
                        "tag": "virtual",
                        "children": [
                            {
                                "tag": "wx-view",
                                "attr": {},
                                "children": [
                                    "if"
                                ],
                                "n": [],
                                "raw": {},
                                "generics": {}
                            }
                        ],
                        "wxVkey": 1,
                        "wxXCkey": 1
                    },
                    {
                        "tag": "wx-view",
                        "attr": {
                            "attr": "I am attr value",
                            "bindtap": "onTap",
                            "id": "xx"
                        },
                        "children": [
                            "node content"
                        ],
                        "n": [],
                        "raw": {},
                        "generics": {}
                    },
                    {
                        "tag": "wx-comp",
                        "attr": {
                            "a": "123",
                            "b": "haha"
                        },
                        "children": [
                            {
                                "tag": "wx-view",
                                "attr": {},
                                "children": [
                                    "I am slot"
                                ],
                                "n": [],
                                "raw": {},
                                "generics": {}
                            }
                        ],
                        "n": [],
                        "raw": {},
                        "generics": {}
                    },
                    {
                        "tag": "virtual",
                        "children": [
                            {
                                "tag": "virtual",
                                "wxKey": 1,
                                "children": [
                                    {
                                        "tag": "wx-view",
                                        "attr": {},
                                        "children": [
                                            "1-item"
                                        ],
                                        "n": [],
                                        "raw": {},
                                        "generics": {}
                                    }
                                ]
                            },
                            {
                                "tag": "virtual",
                                "wxKey": 2,
                                "children": [
                                    {
                                        "tag": "wx-view",
                                        "attr": {},
                                        "children": [
                                            "2-item"
                                        ],
                                        "n": [],
                                        "raw": {},
                                        "generics": {}
                                    }
                                ]
                            },
                            {
                                "tag": "virtual",
                                "wxKey": 3,
                                "children": [
                                    {
                                        "tag": "wx-view",
                                        "attr": {},
                                        "children": [
                                            "3-item"
                                        ],
                                        "n": [],
                                        "raw": {},
                                        "generics": {}
                                    }
                                ]
                            }
                        ],
                        "wxXCkey": 2
                    },
                    {
                        "tag": "wx-view",
                        "attr": {},
                        "children": [
                            "in block1"
                        ],
                        "n": [],
                        "raw": {},
                        "generics": {}
                    },
                    {
                        "tag": "wx-text",
                        "attr": {},
                        "children": [
                            "in block2"
                        ],
                        "n": [],
                        "raw": {},
                        "generics": {}
                    }
                ],
                "n": [],
                "raw": {},
                "generics": {}
            },
            {
                "tag": "wx-view",
                "attr": {},
                "children": [
                    "foot"
                ],
                "n": [],
                "raw": {},
                "generics": {}
            }
        ]
    }