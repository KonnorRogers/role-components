import { html, fixture, assert } from "@open-wc/testing"
import "../exports/components/menu/menu-register.js"

suite('<role-menu>', () => {
  test("Should render a component", async () => {
    const el = await fixture(html` <role-menu></role-menu> `);

    assert(el.matches(":defined"), `"${el.tagName.toLowerCase()}" element should be ":defined"`)
  })
})
