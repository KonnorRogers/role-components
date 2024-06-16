import "../exports/tab/tab-register.js"

suite('<role-tab>', () => {
  test("Should render a component", async () => {
    const el = await fixture(html` <role-tab></role-tab> `);

    expect(el).to.exist;
  })
})
