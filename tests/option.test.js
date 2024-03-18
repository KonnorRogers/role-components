import { html, fixture, assert, aTimeout } from '@open-wc/testing';
import { sendKeys } from "@web/test-runner-commands"

import "../exports/option/option-register.js"

test("Should set it's label to textContent if none provided", async () => {
  const option = await fixture(html`<role-option>Option 1</role-option>`)

  assert.equal(option.label, option.textContent)
})

