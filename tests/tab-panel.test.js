import { assert, fixture, html } from "@open-wc/testing"
import "../exports/components/tab-panel/tab-panel-register.js"

suite('<role-tab-panel>', () => {
  test("Should render a component", async () => {
    const el = await fixture(html` <role-tab-panel></role-tab-panel> `);

    assert(el.matches(":defined"), `"${el.tagName.toLowerCase()}" element should be ":defined"`)
  })
})
