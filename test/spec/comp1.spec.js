let simulate;

describe("comp1", () => {
  beforeAll(async () => {
    simulate = await import(
      "http://localhost:8080/@/dist/miniprogram_simulate.all.js"
    );
  });

  it("should run successfully", () => {
    const id = simulate.loadComponent("/test/comp1/index");

    const comp = simulate.render(id, {
      prop: "index.test.properties",
      hasChild: true,
    });

    comp.attach(document.body);

    expect(comp.innerHTML).toBe(
      '<view class="main--index">index.test.properties</view><comp1><view class="main--index">inner</view></comp1>'
    );
    expect(
      window.getComputedStyle(comp.querySelector(".index").dom).color
    ).toBe("rgb(0, 128, 0)");
    expect(comp.dom.tagName).toBe("MAIN");

    comp.triggerPageLifeTime("show", { test: "xxx" });

    expect(comp.instance.data.observerArr).toEqual([
      "index.test.properties",
      "index.properties",
      "index.test.properties",
      "observers",
      "pageShow",
      { test: "xxx" },
    ]);

    comp.detach()
  });
});
