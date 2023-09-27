let simulate;

describe("comp6", () => {
  beforeAll(async () => {
    simulate = await import(
      "http://localhost:8080/@/dist/miniprogram_simulate.all.js"
    );
  });

  it("should run successfully", async () => {
    const id = simulate.loadComponent("/test/comp6/index");

    const comp = simulate.render(id, {
      prop: "index.test.properties",
      hasChild: true,
    });

    comp.attach(document.body);

    expect(comp.innerHTML).toBe(
      simulate.trimHTML(`
    <view class="main--index">index.test.properties</view>
    <view>index.test.properties</view>
    <view>index.properties</view>
  `)
    );
    expect(
      window.getComputedStyle(comp.querySelector(".index").dom).color
    ).toBe("rgb(0, 128, 0)");
    expect(comp.dom.tagName).toBe("MAIN");

    expect(comp.instance.data.observerArr).toEqual([
      "index.test.properties",
      "index.properties",
    ]);

    comp.detach();
  });
});
