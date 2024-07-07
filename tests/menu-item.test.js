import { html, fixture, assert } from "@open-wc/testing"
import "../exports/components/menu-item/menu-item-register.js"

suite('<role-menu-item>', () => {
  test("Should render a component", async () => {
    const el = await fixture(html` <role-menu-item></role-menu-item> `);

    assert(el.matches(":defined"), `"${el.tagName.toLowerCase()}" element should be ":defined"`)
  })
})
