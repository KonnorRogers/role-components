import { html, fixture, assert } from "@open-wc/testing"
import "../exports/components/menu-dropdown/menu-dropdown-register.js"

suite('<role-menu-dropdown>', () => {
  test("Should render a component", async () => {
    const el = await fixture(html` <role-menu-dropdown></role-menu-dropdown> `);

    assert(el.matches(":defined"), `"${el.tagName.toLowerCase()}" element should be ":defined"`)
  })
})
