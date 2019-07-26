const path = require('path')

const wxss = require('../../src/wxss')

test('getContent', () => {
    expect(wxss.getContent(path.join(__dirname, './wxss/index.wxss'))).toBe(`#id {
    position: absolute;
    left: 0;
    right: 0;
}\n
#haha {
    color: red;
}\n\n
.a {
    color: green;
    width: 100%;
}\n
#hehe {
    color: black;
}\n
.b {
    height: 100%;
}\n
.c {
    background-color: yellow;
    background-repeat: no-repeat;
    font-size: 13px;
}\n`)
})

test('compile', () => {
    expect(wxss.compile('.class{width:100%;}', {prefix: 'a'})).toBe('.a--class{width:100%}')
    expect(wxss.compile('.class {width:100%;}', {prefix: 'a'})).toBe('.a--class{width:100%}')
    expect(wxss.compile('.class .class-2{width:100%;}', {prefix: 'a'})).toBe('.a--class .a--class-2{width:100%}')
    expect(wxss.compile('div.class{width:100%;}', {prefix: 'a'})).toBe('div.a--class{width:100%}')
    expect(wxss.compile('#id.class{width:100%;}', {prefix: 'a'})).toBe('#id.a--class{width:100%}')
    expect(wxss.compile('.class[src]{width:100%;}', {prefix: 'a'})).toBe('.a--class[src]{width:100%}')
    expect(wxss.compile('.class:hover{width:100%;}', {prefix: 'a'})).toBe('.a--class:hover{width:100%}')
    expect(wxss.compile('.class::after{width:100%;}', {prefix: 'a'})).toBe('.a--class::after{width:100%}')
    expect(wxss.compile('div#id.class.class-2[src="haha"]::after{width:100%;}', {prefix: 'a'})).toBe('div#id.a--class.a--class-2[src=haha]::after{width:100%}')
    expect(wxss.compile('.class.class-2, #id.class_3{width:100%;}', {prefix: 'a'})).toBe('.a--class.a--class-2,#id.a--class_3{width:100%}')
    expect(wxss.compile(`
        .class.class-2{
            width: 100%;
            height: 100rpx;
        }
        #id.class_3 {
            display: block;
        }
        .class4 .class-5 {
            background-image: url("https://haha.hehe.heihei");
            backgorund-size: cover;
            backgournd-repeat: no-repeat;
        }
    `, {prefix: 'abc-d_ef'})).toBe('.abc-d_ef--class.abc-d_ef--class-2{width:100%;height:100rpx}#id.abc-d_ef--class_3{display:block}.abc-d_ef--class4 .abc-d_ef--class-5{background-image:url(https://haha.hehe.heihei);backgorund-size:cover;backgournd-repeat:no-repeat}')
    expect(wxss.compile(`
        .class {
            .inner-class-1 {
                width: 100%;
            }

            .inner-class-2 {
                width: 100rpx;
            }
        }
    `, {prefix: 'l'})).toBe(`.l--class{.l--inner-class-1 {
                width: 100%;
            }

            .l--inner-class-2 {
                width: 100rpx;
            }}`)
    expect(wxss.compile(`
        .class {
            .inner-class-1 {
                width: 100%;;
            }

            .inner-class-2 {
                width: 100rpx;
            }
        }
    `, {prefix: 'l', less: true})).toBe('.l--class .l--inner-class-1{width:100%}.l--class .l--inner-class-2{width:100rpx}')
})

test('insert', () => {
    const id = 'abc'
    expect(document.querySelector(`style#${id}`)).toBe(null)

    wxss.insert('.class{width:100%;}', id)
    expect(document.querySelector(`style#${id}`).innerHTML).toBe('.class{width:100%;}')

    wxss.insert(['.class{width:100%;}', '.class2{height:100rpx;}'], id)
    expect(document.querySelector(`style#${id}`).innerHTML).toBe('.class{width:100%;}.class2{height:100px;}')
})
