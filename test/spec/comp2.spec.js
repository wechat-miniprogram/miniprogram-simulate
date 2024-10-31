let simulate;

describe("comp2", () => {
  beforeAll(async () => {
    simulate = await import(
      "http://localhost:8080/@/dist/miniprogram_simulate.all.js"
    );
  });

  it("should run successfully", () => {
    const id = simulate.loadComponent("/test/comp2/index", 'custom-comp')

    const comp = simulate.render(id, { prop: "index.test.properties" });

    comp.attach(document.body);

    expect(comp.innerHTML).toBe(
      simulate.trimHTML(`
    <view class="custom-comp--index">index.test.properties</view>
    <view index="0" type="3">haha</view>
    <view index="1" type="4">hehe</view>
    <other-comp class="custom-comp--other"><view class="other-comp--index">other.properties</view></other-comp>
  `)
    );
    expect(
      window.getComputedStyle(comp.querySelector(".index").dom).color
    ).toBe("rgb(0, 128, 0)");
    // expect(
    //   window.getComputedStyle(comp.querySelector(".index").dom).width
    // ).toBe("10vw");
    expect(
      window.getComputedStyle(
        comp.querySelector(".other").querySelector(".index").dom
      ).color
    ).toBe("rgb(255, 255, 0)");
    expect(comp.querySelector(".other").instance.getStr).toBeInstanceOf(
      Function
    );
    expect(comp.querySelector(".other").instance.getStr()).toBe("other");
    expect(comp.dom.tagName).toBe("CUSTOM-COMP");
    expect(comp.querySelector(".other").instance.selectOwnerComponent()).toBe(
      comp.instance
    );

    comp.detach()
  });
});
