const path = require('path')
const simulate = require('../../index')

function runTest(id) {
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
  expect(simulate.match(comp.dom, '<custom-ul class="main--ul"><wx-view><custom-li class="main--li"><wx-text>li-1</wx-text></custom-li><custom-li class="main--li"><wx-text>li-2</wx-text></custom-li></wx-view></custom-ul>')).toBe(true)
  expect(relationsData.ulLink).toBe(2)
  expect(relationsData.ulLinkTargetList.length).toBe(2)
  expect(relationsData.ulLinkTargetList[0]).toBe(comp.querySelectorAll('.li')[0].instance)
  expect(relationsData.ulLinkTargetList[1]).toBe(comp.querySelectorAll('.li')[1].instance)
  expect(relationsData.liLink).toBe(2)
  expect(relationsData.liLinkTargetList.length).toBe(2)
  expect(relationsData.liLinkTargetList[0]).toBe(ul)
  expect(relationsData.liLinkTargetList[1]).toBe(ul)

  let relationNodes = ul.getRelationNodes('./custom-li')
  expect(relationNodes.length).toBe(2)
  expect(relationNodes[0]).toBe(relationsData.ulLinkTargetList[0])
  expect(relationNodes[1]).toBe(relationsData.ulLinkTargetList[1])

  let relationNodes2 = relationNodes[0].getRelationNodes('./custom-ul')
  expect(relationNodes2.length).toBe(1)
  expect(relationNodes2[0]).toBe(ul)
  relationNodes2 = relationNodes[1].getRelationNodes('./custom-ul')
  expect(relationNodes2.length).toBe(1)
  expect(relationNodes2[0]).toBe(ul)

  // update
  relationsData.ulLinkTargetList.length = 0
  relationsData.liLinkTargetList.length = 0
  comp.setData({list: [2, 3, 4]})
  expect(simulate.match(comp.dom, '<custom-ul class="main--ul"><wx-view><custom-li class="main--li"><wx-text>li-2</wx-text></custom-li><custom-li class="main--li"><wx-text>li-3</wx-text></custom-li><custom-li class="main--li"><wx-text>li-4</wx-text></custom-li></wx-view></custom-ul>')).toBe(true)
  expect(relationsData.ulLink).toBe(4)
  expect(relationsData.ulLinkTargetList.length).toBe(2)
  expect(relationsData.ulLinkTargetList[0]).toBe(comp.querySelectorAll('.li')[1].instance)
  expect(relationsData.ulLinkTargetList[1]).toBe(comp.querySelectorAll('.li')[2].instance)
  expect(relationsData.ulUnlink).toBe(1)
  expect(relationsData.ulUnlinkTargetList.length).toBe(1)
  expect(relationsData.ulUnlinkTargetList[0]).toBe(relationNodes[0])
  expect(relationsData.liLink).toBe(4)
  expect(relationsData.liLinkTargetList.length).toBe(2)
  expect(relationsData.liLinkTargetList[0]).toBe(ul)
  expect(relationsData.liLinkTargetList[1]).toBe(ul)
  expect(relationsData.liUnlink).toBe(1)
  expect(relationsData.liUnlinkTargetList.length).toBe(1)
  expect(relationsData.liUnlinkTargetList[0]).toBe(ul)

  relationNodes = ul.getRelationNodes('./custom-li')
  expect(relationNodes.length).toBe(3)
  expect(relationNodes[0]).toBe(comp.querySelectorAll('.li')[0].instance)
  expect(relationNodes[1]).toBe(relationsData.ulLinkTargetList[0])
  expect(relationNodes[2]).toBe(relationsData.ulLinkTargetList[1])

  relationNodes2 = relationNodes[0].getRelationNodes('./custom-ul')
  expect(relationNodes2.length).toBe(1)
  expect(relationNodes2[0]).toBe(ul)
  relationNodes2 = relationNodes[1].getRelationNodes('./custom-ul')
  expect(relationNodes2.length).toBe(1)
  expect(relationNodes2[0]).toBe(ul)
  relationNodes2 = relationNodes[2].getRelationNodes('./custom-ul')
  expect(relationNodes2.length).toBe(1)
  expect(relationNodes2[0]).toBe(ul)

  // detach
  relationsData.ulLinkTargetList.length = 0
  relationsData.ulUnlinkTargetList.length = 0
  relationsData.liLinkTargetList.length = 0
  relationsData.liUnlinkTargetList.length = 0
  comp.detach()
  expect(relationsData.ulLink).toBe(4)
  expect(relationsData.ulLinkTargetList.length).toBe(0)
  expect(relationsData.ulUnlink).toBe(4)
  expect(relationsData.ulUnlinkTargetList.length).toBe(3)
  expect(relationsData.ulUnlinkTargetList[0]).toBe(relationNodes[0])
  expect(relationsData.ulUnlinkTargetList[1]).toBe(relationNodes[1])
  expect(relationsData.ulUnlinkTargetList[2]).toBe(relationNodes[2])
  expect(relationsData.liLink).toBe(4)
  expect(relationsData.liLinkTargetList.length).toBe(0)
  expect(relationsData.liUnlink).toBe(4)
  expect(relationsData.liUnlinkTargetList.length).toBe(3)
  expect(relationsData.liUnlinkTargetList[0]).toBe(ul)
  expect(relationsData.liUnlinkTargetList[1]).toBe(ul)
  expect(relationsData.liUnlinkTargetList[2]).toBe(ul)

  relationNodes = ul.getRelationNodes('./custom-li')
  expect(relationNodes.length).toBe(0)
}

test('comp8', () => {
  const id = simulate.load(path.resolve(__dirname, './index'))
  runTest(id)
})
