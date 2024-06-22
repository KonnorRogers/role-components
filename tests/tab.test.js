import { html, fixture, assert } from "@open-wc/testing"
import "../exports/components/tab/tab-register.js"

suite('<role-tab>', () => {
  test("Should render a component", async () => {
    const el = await fixture(html` <role-tab></role-tab> `);

    assert(el.matches(":defined"), `"${el.tagName.toLowerCase()}" element should be ":defined"`)
  })
})
