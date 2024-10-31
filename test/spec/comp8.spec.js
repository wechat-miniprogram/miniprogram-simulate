let simulate;

describe("comp8", () => {
  beforeAll(async () => {
    simulate = await import(
      "http://localhost:8080/@/dist/miniprogram_simulate.all.js"
    );
  });

  it("should run successfully", async () => {
    const id = simulate.loadComponent("/test/comp8/index");

    const comp = simulate.render(id);

    const relationsData = (window._relations = window._relations || {});
    relationsData.ulLink = 0;
    relationsData.ulLinkTargetList = [];
    relationsData.ulUnlink = 0;
    relationsData.ulUnlinkTargetList = [];
    relationsData.liLink = 0;
    relationsData.liLinkTargetList = [];
    relationsData.liUnlink = 0;
    relationsData.liUnlinkTargetList = [];

    comp.attach(document.body);

    const ul = comp.querySelectorAll(".ul")[0].instance;

    // init
    expect(comp.innerHTML).toBe(
      '<custom-ul class="main--ul"><view><custom-li class="main--li"><text>li-1</text></custom-li><custom-li class="main--li"><text>li-2</text></custom-li></view></custom-ul>'
    );
    expect(relationsData.ulLink).toBe(2);
    expect(relationsData.ulLinkTargetList.length).toBe(2);
    expect(relationsData.ulLinkTargetList[0]).toBe(
      comp.querySelectorAll(".li")[0].instance
    );
    expect(relationsData.ulLinkTargetList[1]).toBe(
      comp.querySelectorAll(".li")[1].instance
    );
    expect(relationsData.liLink).toBe(2);
    expect(relationsData.liLinkTargetList.length).toBe(2);
    expect(relationsData.liLinkTargetList[0]).toBe(ul);
    expect(relationsData.liLinkTargetList[1]).toBe(ul);

    let relationNodes = ul.getRelationNodes("./custom-li");
    expect(relationNodes.length).toBe(2);
    expect(relationNodes[0]).toBe(relationsData.ulLinkTargetList[0]);
    expect(relationNodes[1]).toBe(relationsData.ulLinkTargetList[1]);

    let relationNodes2 = relationNodes[0].getRelationNodes("./custom-ul");
    expect(relationNodes2.length).toBe(1);
    expect(relationNodes2[0]).toBe(ul);
    relationNodes2 = relationNodes[1].getRelationNodes("./custom-ul");
    expect(relationNodes2.length).toBe(1);
    expect(relationNodes2[0]).toBe(ul);

    // update
    relationsData.ulLinkTargetList.length = 0;
    relationsData.liLinkTargetList.length = 0;
    comp.setData({ list: [2, 3, 4] });
    expect(comp.innerHTML).toBe(
      '<custom-ul class="main--ul"><view><custom-li class="main--li"><text>li-2</text></custom-li><custom-li class="main--li"><text>li-3</text></custom-li><custom-li class="main--li"><text>li-4</text></custom-li></view></custom-ul>'
    );
    expect(relationsData.ulLink).toBe(4);
    expect(relationsData.ulLinkTargetList.length).toBe(2);
    expect(relationsData.ulLinkTargetList[0]).toBe(
      comp.querySelectorAll(".li")[1].instance
    );
    expect(relationsData.ulLinkTargetList[1]).toBe(
      comp.querySelectorAll(".li")[2].instance
    );
    expect(relationsData.ulUnlink).toBe(1);
    expect(relationsData.ulUnlinkTargetList.length).toBe(1);
    expect(relationsData.ulUnlinkTargetList[0]).toBe(relationNodes[0]);
    expect(relationsData.liLink).toBe(4);
    expect(relationsData.liLinkTargetList.length).toBe(2);
    expect(relationsData.liLinkTargetList[0]).toBe(ul);
    expect(relationsData.liLinkTargetList[1]).toBe(ul);
    expect(relationsData.liUnlink).toBe(1);
    expect(relationsData.liUnlinkTargetList.length).toBe(1);
    expect(relationsData.liUnlinkTargetList[0]).toBe(ul);

    relationNodes = ul.getRelationNodes("./custom-li");
    expect(relationNodes.length).toBe(3);
    expect(relationNodes[0]).toBe(comp.querySelectorAll(".li")[0].instance);
    expect(relationNodes[1]).toBe(relationsData.ulLinkTargetList[0]);
    expect(relationNodes[2]).toBe(relationsData.ulLinkTargetList[1]);

    relationNodes2 = relationNodes[0].getRelationNodes("./custom-ul");
    expect(relationNodes2.length).toBe(1);
    expect(relationNodes2[0]).toBe(ul);
    relationNodes2 = relationNodes[1].getRelationNodes("./custom-ul");
    expect(relationNodes2.length).toBe(1);
    expect(relationNodes2[0]).toBe(ul);
    relationNodes2 = relationNodes[2].getRelationNodes("./custom-ul");
    expect(relationNodes2.length).toBe(1);
    expect(relationNodes2[0]).toBe(ul);

    // detach
    relationsData.ulLinkTargetList.length = 0;
    relationsData.ulUnlinkTargetList.length = 0;
    relationsData.liLinkTargetList.length = 0;
    relationsData.liUnlinkTargetList.length = 0;
    comp.detach();
    expect(relationsData.ulLink).toBe(4);
    expect(relationsData.ulLinkTargetList.length).toBe(0);
    expect(relationsData.ulUnlink).toBe(4);
    expect(relationsData.ulUnlinkTargetList.length).toBe(3);
    expect(relationsData.ulUnlinkTargetList[0]).toBe(relationNodes[0]);
    expect(relationsData.ulUnlinkTargetList[1]).toBe(relationNodes[1]);
    expect(relationsData.ulUnlinkTargetList[2]).toBe(relationNodes[2]);
    expect(relationsData.liLink).toBe(4);
    expect(relationsData.liLinkTargetList.length).toBe(0);
    expect(relationsData.liUnlink).toBe(4);
    expect(relationsData.liUnlinkTargetList.length).toBe(3);
    expect(relationsData.liUnlinkTargetList[0]).toBe(ul);
    expect(relationsData.liUnlinkTargetList[1]).toBe(ul);
    expect(relationsData.liUnlinkTargetList[2]).toBe(ul);

    relationNodes = ul.getRelationNodes("./custom-li");
    expect(relationNodes.length).toBe(0);
  });
});
