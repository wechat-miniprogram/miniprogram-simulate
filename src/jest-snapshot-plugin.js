const _markup = require('pretty-format/build/plugins/lib/markup')

const testSymbol =
  typeof Symbol === 'function' && Symbol.for
      ? Symbol.for('j-component.json')
      : 0xd846fe

const test = function test(val) {
    return val && val.$$typeof === testSymbol
}

const printAttrs = function printAttrs(
    attrs,
    config,
    indentation,
    depth,
    refs,
    printer
) {
    const indentationNext = indentation + config.indent
    const colors = config.colors
    return Array.from(attrs)
        .sort(function(a, b) {
            return a.name.localeCompare(b.name)
        })
        .map(function(attr) {
            const name = attr.name
            const value = attr.value
            let printed = printer(value, config, indentationNext, depth, refs)

            if (typeof value !== 'string') {
                if (printed.indexOf('\n') !== -1) {
                    printed =
            config.spacingOuter +
            indentationNext +
            printed +
            config.spacingOuter +
            indentation
                }

                printed = '"{{' + printed + '}}"'
            }

            return (
                config.spacingInner +
        indentation +
        colors.prop.open +
        name +
        colors.prop.close +
        '=' +
        colors.value.open +
        printed +
        colors.value.close
            )
        })
        .join('')
}

const printEvent = function printEvent(
    event,
    config,
    indentation,
    depth,
    refs,
    printer
) {
    const indentationNext = indentation + config.indent
    const colors = config.colors
    return Object.keys(event)
        .sort()
        .map(function(eventName) {
            const eventInfo = event[eventName]
            const handler = eventInfo.handler
            const isCapture = eventInfo.isCapture
            const isMutated = eventInfo.isMutated
            const isCatch = eventInfo.isCatch
            const attrName =
        (isCapture ? 'capture-' : '') +
        (isMutated ? 'mut-' : '') +
        (isCatch ? 'catch' : 'bind') +
        ':' +
        eventName

            const printed = printer(handler, config, indentationNext, depth, refs)
            return (
                config.spacingInner +
        indentation +
        colors.prop.open +
        attrName +
        colors.prop.close +
        '=' +
        colors.value.open +
        printed +
        colors.value.close
            )
        })
        .join('')
}

const printProps = function printProps(
    object,
    config,
    indentation,
    depth,
    refs,
    printer
) {
    return (
        printAttrs(object.attrs, config, indentation, depth, refs, printer) +
    printEvent(object.event, config, indentation, depth, refs, printer)
    )
}

const serialize = function serialize(
    object,
    config,
    indentation,
    depth,
    refs,
    printer
) {
    return ++depth > config.maxDepth
        ? _markup.printElementAsLeaf(object.tagName, config)
        : _markup.printElement(
            object.tagName,
            printProps(
                object,
                config,
                indentation + config.indent,
                depth,
                refs,
                printer
            ),
            _markup.printChildren(
                object.children,
                config,
                indentation + config.indent,
                depth,
                refs,
                printer
            ),
            config,
            indentation
        )
}

const plugin = {
    serialize,
    test,
}

module.exports = plugin
