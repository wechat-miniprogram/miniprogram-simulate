Component({
    relations: {
        './custom-li': {
            type: 'child',
            linked(target) {
                window._relations.ulLink++
                window._relations.ulLinkTargetList.push(target)
            },
            unlinked(target) {
                window._relations.ulUnlink++
                window._relations.ulUnlinkTargetList.push(target)
            },
        },
    },
})
