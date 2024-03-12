// import from general testing library
import { html, fixture, assert, aTimeout } from '@open-wc/testing';
import { sendKeys } from "@web/test-runner-commands"

import "../exports/listbox/listbox-register.js"
import "../exports/option/option-register.js"

// Single select
test("Should properly check items in the listbox", async () => {
  const listbox = await fixture(html`
    <role-listbox style="height: 200px;">
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

  await aTimeout(10)
  listbox.focus()

  const getOptions = () => listbox.querySelectorAll("role-option")
  await aTimeout(10)
  await sendKeys({ press: "ArrowDown" })
  await aTimeout(10)

  const isSelected = (index) => {
    const options = getOptions()
    assert.equal(options[index].id, listbox.getAttribute("aria-activedescendant"))
    assert.equal(options[index].selected, true)
    assert.equal(options[index].current, true)
    assert.equal(options[index].getAttribute("aria-selected"), "true")
    assert.equal(options[index].getAttribute("aria-current"), "true")
  }

  const isNotSelected = (index) => {
    const options = getOptions()
    assert.equal(options[index].selected, false)
    assert.equal(options[index].current, false)
    assert.equal(options[index].getAttribute("aria-selected"), "false")
    assert.equal(options[index].getAttribute("aria-current"), "false")
  }

  isSelected(0)
  isNotSelected(1)

  await aTimeout(10)
  await sendKeys({ press: "ArrowDown" })
  await aTimeout(10)

  isNotSelected(0)
  isSelected(1)

  // Pressing home key brings us to the beginning
  await aTimeout(10)
  await sendKeys({ press: "Home" })
  await aTimeout(10)

  isNotSelected(1)
  isSelected(0)

  // Pressing end key brings us to the end
  await aTimeout(10)
  await sendKeys({ press: "End" })
  await aTimeout(10)

  // Pressing end key
  isNotSelected(0)
  isSelected(getOptions().length - 1)
})

// Multiselect
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

  const getOptions = () => listbox.querySelectorAll("role-option")

  const isSelected = (index) => {
    const options = getOptions()
    assert.equal(options[index].selected, true)
    assert.equal(options[index].getAttribute("aria-selected"), "true")
  }

  const isNotSelected = (index) => {
    const options = getOptions()
    assert.equal(options[index].selected, false)
    assert.equal(options[index].getAttribute("aria-selected"), "false")
  }

  const isCurrent = (index) => {
    const options = getOptions()
    assert.equal(options[index].id, listbox.getAttribute("aria-activedescendant"))
    assert.equal(options[index].current, true)
    assert.equal(options[index].getAttribute("aria-current"), "true")
  }

  const isNotCurrent = (index) => {
    const options = getOptions()
    assert.equal(options[index].current, false)
    assert.equal(options[index].getAttribute("aria-current"), "false")
  }

  await aTimeout(10)

  // Accessibility check
  assert.equal(listbox.getAttribute("aria-multiselectable"), "true")
  listbox.focus()
  await aTimeout(10)
  isNotSelected(0)
  isNotCurrent(0)

  await aTimeout(10)
  await sendKeys({ press: "ArrowDown" })
  await aTimeout(100)

  isNotSelected(0)
  isCurrent(0)

  await aTimeout(10)
  await sendKeys({ press: "Space" })
  await aTimeout(10)

  isSelected(0)
  isCurrent(0)

  await aTimeout(10)
  await sendKeys({ press: "ArrowDown" })
  await aTimeout(10)

  isNotSelected(1)
  isCurrent(1)

  isNotCurrent(0)
  isSelected(0)
})
