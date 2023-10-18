let simulate;

describe("comp10", () => {
  beforeAll(async () => {
    simulate = await import(
      "http://localhost:8080/@/dist/miniprogram_simulate.all.js"
    );
  });

  it("should run successfully", async () => {
    const id = simulate.loadComponent("/test/comp10/index");

    const comp = simulate.render(id);

    comp.attach(document.body);

    expect(comp.innerHTML).toBe("<view>hello june</view>");

    comp.detach();
  });
});
