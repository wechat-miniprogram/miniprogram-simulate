class IntersectionObserver {
    constructor() {
        // TODO
    }

    disconnect() {
        // TODO
    }

    observe() {
        // TODO
    }

    relativeTo() {
        // TODO
    }

    relativeToViewport() {
        // TODO
    }
}

module.exports = {
    createSelectorQuery() {
        return {
            in(compInst) {
                return compInst.createSelectorQuery()
            },
        }
    },
    createIntersectionObserver() {
        return new IntersectionObserver()
    },
}
