// import from general testing library
import { html, fixture, assert, aTimeout } from '@open-wc/testing';
import { sendKeys } from "@web/test-runner-commands"

import "../exports/listbox/listbox-register.js"
import "../exports/option/option-register.js"

test("Should properly set aria-selected and aria-checked for options in a multiselect", async () => {
  const listbox = await fixture(html`
    <role-listbox multi-select style="height: 200px;">
      <role-option value="1">Option 1</role-option>
      <role-option value="2">Option 2</role-option>
      <role-option value="3">Option 3</role-option>
      <role-option value="4">Option 4</role-option>
      <role-option value="5">Option 5</role-option>
      <role-option value="6">Option 6</role-option>
      <role-option value="7">Option 7</role-option>
      <role-option value="8">Option 8</role-option>
      <role-option value="9">Option 9</role-option>
      <role-option value="10">Option 10</role-option>
    </role-listbox>
  `)

  await aTimeout(0)
  listbox.focus()

  const options = listbox.querySelectorAll("role-option")
  await aTimeout(10)
  await sendKeys({ press: "ArrowDown" })
  await aTimeout(10)

  assert.equal(options[0].selected, false)
  assert.equal(options[0].current, true)

  console.log(options[0])
  assert.equal(options[0].getAttribute("aria-selected"), "false")
  assert.equal(options[0].getAttribute("aria-current"), "true")
})
