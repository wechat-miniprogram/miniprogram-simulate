let simulate;

describe("comp9", () => {
  beforeAll(async () => {
    simulate = await import(
      "http://localhost:8080/@/dist/miniprogram_simulate.all.js"
    );
  });

  it("should run successfully", async () => {
    const id = simulate.loadComponent("/test/comp9/index");

    const comp = simulate.render(id, {
      prop: "index.test.properties",
      hasChild: true,
    });

    comp.attach(document.body);

    expect(comp.innerHTML).toBe(
      '<view class="main--index">index.test.properties</view><view>123</view>'
    );
    expect(
      window.getComputedStyle(comp.querySelector(".index").dom).color
    ).toBe("rgb(0, 128, 0)");
    expect(comp.dom).toBe(null);

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
