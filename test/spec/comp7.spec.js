let simulate;

describe("comp7", () => {
  beforeAll(async () => {
    simulate = await import(
      "http://localhost:8080/@/dist/miniprogram_simulate.all.js"
    );
  });

  it("should run successfully", async () => {
    const id = simulate.loadComponent("/test/comp7/index");

    const comp = simulate.render(id);

    comp.attach(document.body);

    expect(comp.innerHTML).toBe(
      "<view>some msg</view><view>'hello world' from tools.wxs</view>"
    );

    comp.detach()

  });
});
