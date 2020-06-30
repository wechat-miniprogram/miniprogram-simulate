Component({
    relations: {
        './custom-ul': {
            type: 'parent',
            linked(target) {
                window._relations.liLink++
                window._relations.liLinkTargetList.push(target)
            },
            unlinked(target) {
                window._relations.liUnlink++
                window._relations.liUnlinkTargetList.push(target)
            },
        },
    },
})
