import { assert, fixture, html } from "@open-wc/testing"

import "../exports/components/tab-list/tab-list-register.js"

suite('<role-tab-list>', () => {
  test("Should render a component", async () => {
    const el = await fixture(html` <role-tab-list></role-tab-list> `);

    assert(el.matches(":defined"), `"${el.tagName.toLowerCase()}" element should be ":defined"`)
  })
})
