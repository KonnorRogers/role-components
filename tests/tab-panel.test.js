import "../exports/tab-panel/tab-panel-register.js"

suite('<role-tab-panel>', () => {
  test("Should render a component", async () => {
    const el = await fixture(html` <role-tab-panel></role-tab-panel> `);

    expect(el).to.exist;
  })
})
