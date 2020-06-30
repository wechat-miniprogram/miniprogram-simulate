/* global simulate */
const path = require('path')
const expect = require('chai').expect

describe('comp8', () => {
    it('should run successfully', async() => {
        const id = simulate.load(path.join(__dirname, '../comp8/index'))
        const comp = simulate.render(id)

        const relationsData = window._relations = window._relations || {}
        relationsData.ulLink = 0
        relationsData.ulLinkTargetList = []
        relationsData.ulUnlink = 0
        relationsData.ulUnlinkTargetList = []
        relationsData.liLink = 0
        relationsData.liLinkTargetList = []
        relationsData.liUnlink = 0
        relationsData.liUnlinkTargetList = []

        const parent = document.createElement('parent-wrapper')
        comp.attach(parent)

        const ul = comp.querySelectorAll('.ul')[0].instance

        // init
        expect(simulate.match(comp.dom, '<custom-ul class="main--ul"><wx-view><custom-li class="main--li"><wx-text>li-1</wx-text></custom-li><custom-li class="main--li"><wx-text>li-2</wx-text></custom-li></wx-view></custom-ul>')).to.equal(true)
        expect(relationsData.ulLink).to.equal(2)
        expect(relationsData.ulLinkTargetList.length).to.equal(2)
        expect(relationsData.ulLinkTargetList[0]).to.equal(comp.querySelectorAll('.li')[0].instance)
        expect(relationsData.ulLinkTargetList[1]).to.equal(comp.querySelectorAll('.li')[1].instance)
        expect(relationsData.liLink).to.equal(2)
        expect(relationsData.liLinkTargetList.length).to.equal(2)
        expect(relationsData.liLinkTargetList[0]).to.equal(ul)
        expect(relationsData.liLinkTargetList[1]).to.equal(ul)

        let relationNodes = ul.getRelationNodes('./custom-li')
        expect(relationNodes.length).to.equal(2)
        expect(relationNodes[0]).to.equal(relationsData.ulLinkTargetList[0])
        expect(relationNodes[1]).to.equal(relationsData.ulLinkTargetList[1])

        let relationNodes2 = relationNodes[0].getRelationNodes('./custom-ul')
        expect(relationNodes2.length).to.equal(1)
        expect(relationNodes2[0]).to.equal(ul)
        relationNodes2 = relationNodes[1].getRelationNodes('./custom-ul')
        expect(relationNodes2.length).to.equal(1)
        expect(relationNodes2[0]).to.equal(ul)

        // update
        relationsData.ulLinkTargetList.length = 0
        relationsData.liLinkTargetList.length = 0
        comp.setData({list: [2, 3, 4]})
        expect(simulate.match(comp.dom, '<custom-ul class="main--ul"><wx-view><custom-li class="main--li"><wx-text>li-2</wx-text></custom-li><custom-li class="main--li"><wx-text>li-3</wx-text></custom-li><custom-li class="main--li"><wx-text>li-4</wx-text></custom-li></wx-view></custom-ul>')).to.equal(true)
        expect(relationsData.ulLink).to.equal(4)
        expect(relationsData.ulLinkTargetList.length).to.equal(2)
        expect(relationsData.ulLinkTargetList[0]).to.equal(comp.querySelectorAll('.li')[1].instance)
        expect(relationsData.ulLinkTargetList[1]).to.equal(comp.querySelectorAll('.li')[2].instance)
        expect(relationsData.ulUnlink).to.equal(1)
        expect(relationsData.ulUnlinkTargetList.length).to.equal(1)
        expect(relationsData.ulUnlinkTargetList[0]).to.equal(relationNodes[0])
        expect(relationsData.liLink).to.equal(4)
        expect(relationsData.liLinkTargetList.length).to.equal(2)
        expect(relationsData.liLinkTargetList[0]).to.equal(ul)
        expect(relationsData.liLinkTargetList[1]).to.equal(ul)
        expect(relationsData.liUnlink).to.equal(1)
        expect(relationsData.liUnlinkTargetList.length).to.equal(1)
        expect(relationsData.liUnlinkTargetList[0]).to.equal(ul)

        relationNodes = ul.getRelationNodes('./custom-li')
        expect(relationNodes.length).to.equal(3)
        expect(relationNodes[0]).to.equal(comp.querySelectorAll('.li')[0].instance)
        expect(relationNodes[1]).to.equal(relationsData.ulLinkTargetList[0])
        expect(relationNodes[2]).to.equal(relationsData.ulLinkTargetList[1])

        relationNodes2 = relationNodes[0].getRelationNodes('./custom-ul')
        expect(relationNodes2.length).to.equal(1)
        expect(relationNodes2[0]).to.equal(ul)
        relationNodes2 = relationNodes[1].getRelationNodes('./custom-ul')
        expect(relationNodes2.length).to.equal(1)
        expect(relationNodes2[0]).to.equal(ul)
        relationNodes2 = relationNodes[2].getRelationNodes('./custom-ul')
        expect(relationNodes2.length).to.equal(1)
        expect(relationNodes2[0]).to.equal(ul)

        // detach
        relationsData.ulLinkTargetList.length = 0
        relationsData.ulUnlinkTargetList.length = 0
        relationsData.liLinkTargetList.length = 0
        relationsData.liUnlinkTargetList.length = 0
        comp.detach()
        expect(relationsData.ulLink).to.equal(4)
        expect(relationsData.ulLinkTargetList.length).to.equal(0)
        expect(relationsData.ulUnlink).to.equal(4)
        expect(relationsData.ulUnlinkTargetList.length).to.equal(3)
        expect(relationsData.ulUnlinkTargetList[0]).to.equal(relationNodes[0])
        expect(relationsData.ulUnlinkTargetList[1]).to.equal(relationNodes[1])
        expect(relationsData.ulUnlinkTargetList[2]).to.equal(relationNodes[2])
        expect(relationsData.liLink).to.equal(4)
        expect(relationsData.liLinkTargetList.length).to.equal(0)
        expect(relationsData.liUnlink).to.equal(4)
        expect(relationsData.liUnlinkTargetList.length).to.equal(3)
        expect(relationsData.liUnlinkTargetList[0]).to.equal(ul)
        expect(relationsData.liUnlinkTargetList[1]).to.equal(ul)
        expect(relationsData.liUnlinkTargetList[2]).to.equal(ul)

        relationNodes = ul.getRelationNodes('./custom-li')
        expect(relationNodes.length).to.equal(0)
    })
})
