import { html, fixture, assert, aTimeout } from '@open-wc/testing';
import { sendKeys } from "@web/test-runner-commands"

import "../exports/combobox/combobox-register.js"
import "../exports/option/option-register.js"

// Single select
test("Should properly check items in the combobox", async () => {
  const form = await fixture(html`
    <form>
      <role-combobox name="combobox">
        <input slot="input">

        <div slot="listbox">
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
        </div>
      </role-combobox>
    </form>
  `)

  const combobox = form.querySelector("role-combobox")
  const options = () => form.querySelectorAll("role-option")

  const formData = () => new FormData(form)
  assert.equal(combobox.value, null)
  assert.lengthOf(formData().getAll("combobox"), 0)

  combobox.focus()
  await aTimeout(10)
  await sendKeys({ press: "ArrowDown" })
  await aTimeout(10)

  assert.equal(combobox.expanded, true)
  assert.equal(combobox.inputElement.getAttribute("aria-expanded"), "true")

  assert.equal(options()[0].selected, false)
  assert.equal(options()[0].current, true)

  assert.equal(combobox.inputElement.value, '')
  assert.equal(combobox.value, null)


  // Select the option
  await aTimeout(10)
  await sendKeys({ press: "Enter" })
  await aTimeout(10)

  assert.equal(combobox.inputElement.value, options()[0].innerText)
  assert.equal(combobox.value, options()[0].innerText)
  assert.lengthOf(formData().getAll("combobox"), 1)
  assert.equal(formData().getAll("combobox")[0], options()[0].innerText)

  assert.equal(options[0].selected, true)
  assert.equal(options[0].current, true)

  assert.equal(options[1].selected, false)
  assert.equal(options[1].current, false)

  await aTimeout(10)
  await sendKeys({ press: "ArrowDown" })
  await aTimeout(10)

  // double check we havent lost selection
  assert.equal(combobox.inputElement.value, options()[0].innerText)
  assert.equal(combobox.value, options()[0].innerText)
  assert.lengthOf(formData().getAll("combobox"), 1)
  assert.equal(formData().getAll("combobox")[0], options()[0].innerText)

  assert.equal(options[0].selected, true)
  assert.equal(options[0].current, false)

  assert.equal(options[1].selected, false)
  assert.equal(options[1].current, true)

  // Select the option
  await aTimeout(10)
  await sendKeys({ press: "Enter" })
  await aTimeout(10)

  assert.equal(options[0].selected, false)
  assert.equal(options[0].current, false)

  assert.equal(options[1].selected, true)
  assert.equal(options[1].current, true)

  // Make sure we deselect previous.
  assert.equal(combobox.inputElement.value, options()[1].innerText)
  assert.equal(combobox.value, options()[1].innerText)
  assert.lengthOf(formData().getAll("combobox"), 1)
  assert.equal(formData().getAll("combobox")[1], options()[1].innerText)
})

// Single select
test("Should properly selected the first selected item in the combobox", async () => {
  const form = await fixture(html`
    <form>
      <role-combobox name="combobox">
        <input slot="input">

        <div slot="listbox">
          <role-option value="1">Option 1</role-option>
          <role-option value="2">Option 2</role-option>
          <role-option value="3">Option 3</role-option>
          <role-option selected value="4">Option 4</role-option>
          <role-option value="5">Option 5</role-option>
          <role-option value="6">Option 6</role-option>
          <role-option value="7">Option 7</role-option>
          <role-option value="8">Option 8</role-option>
          <role-option value="9">Option 9</role-option>
          <role-option value="10">Option 10</role-option>
        </div>
      </role-combobox>
    </form>
  `)

  const combobox = form.querySelector("role-combobox")
  const options = () => form.querySelectorAll("role-option")

  const formData = () => new FormData(form)
  assert.equal(combobox.value, null)
  assert.lengthOf(formData().getAll("combobox"), 0)

  combobox.focus()
  await aTimeout(10)
  await sendKeys({ press: "ArrowDown" })
  await aTimeout(10)

  assert.equal(combobox.expanded, true)
  assert.equal(combobox.inputElement.getAttribute("aria-expanded"), "true")

  assert.equal(options()[0].selected, false)
  assert.equal(options()[0].current, true)

  assert.equal(combobox.inputElement.value, '')
  assert.equal(combobox.value, null)
})
