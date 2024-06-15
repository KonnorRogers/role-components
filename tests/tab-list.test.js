import "../exports/tab-list/tab-list-register.js"

suite('<role-tab-list>', () => {
  test("Should render a component", async () => {
    const el = await fixture(html` <role-tab-list></role-tab-list> `);

    expect(el).to.exist;
  })
})
