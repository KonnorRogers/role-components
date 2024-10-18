// // import from general testing library
// // import "element-internals-polyfill"
import { html, fixture, assert, aTimeout, waitUntil } from '@open-wc/testing';
import { sendKeys } from "@web/test-runner-commands"

import "../exports/components/listbox/listbox-register.js"
import "../exports/components/option/option-register.js"

// Single select
test("Should properly check items in the listbox", async () => {
  const listbox = await fixture(html`
    <role-listbox name="listbox" style="height: 200px;">
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
    assert.isFalse(options[index].hasAttribute("aria-selected"))
    assert.isFalse(options[index].hasAttribute("aria-current"))
    // assert.equal(options[index].hasAttribute("aria-selected"), false)
    // assert.equal(options[index].hasAttribute("aria-current"), false)
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
    <role-listbox multiple style="height: 200px;">
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
    assert.isFalse(options[index].hasAttribute("aria-selected"))
    // assert.equal(options[index].hasAttribute("aria-selected"), false)
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
    assert.isFalse(options[index].hasAttribute("aria-current"))
    // assert.equal(options[index].hasAttribute("aria-current"), false)
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

test("Should properly add selected items to form values", async () => {
  const form = await fixture(html`
    <form>
      <role-listbox multiple name="select" style="height: 200px;">
        <role-option selected value="1">Option 1</role-option>
        <role-option selected value="2">Option 2</role-option>
        <role-option selected value="3">Option 3</role-option>
        <role-option value="4">Option 4</role-option>
        <role-option value="5">Option 5</role-option>
        <role-option value="6">Option 6</role-option>
        <role-option value="7">Option 7</role-option>
        <role-option value="8">Option 8</role-option>
        <role-option value="9">Option 9</role-option>
        <role-option value="10">Option 10</role-option>
      </role-listbox>
    </form>
  `)

  const listbox = form.querySelector("role-listbox")
  const entries = new FormData(form)

  assert.lengthOf(entries.getAll("select"), 3)
  assert.lengthOf(listbox.value.getAll("select"), 3)
  assert.equal(entries.getAll("select")[0], "1")
  assert.equal(entries.getAll("select")[1], "2")
  assert.equal(entries.getAll("select")[2], "3")
})

test("Should properly reset to default selected items", async () => {
  const form = await fixture(html`
    <form>
      <role-listbox multiple name="select" style="height: 200px;">
        <role-option selected value="1">Option 1</role-option>
        <role-option selected value="2">Option 2</role-option>
        <role-option selected value="3">Option 3</role-option>
        <role-option value="4">Option 4</role-option>
        <role-option value="5">Option 5</role-option>
        <role-option value="6">Option 6</role-option>
        <role-option value="7">Option 7</role-option>
        <role-option value="8">Option 8</role-option>
        <role-option value="9">Option 9</role-option>
        <role-option value="10">Option 10</role-option>
      </role-listbox>
    </form>
  `)

  const listbox = form.querySelector("role-listbox")

  let entries = new FormData(form)

  assert.lengthOf(entries.getAll("select"), 3)
  assert.lengthOf(listbox.value.getAll("select"), 3)
  assert.equal(entries.getAll("select")[0], "1")
  assert.equal(entries.getAll("select")[1], "2")
  assert.equal(entries.getAll("select")[2], "3")
  listbox.deselectAll()

  // Despite deselectAll being synchronous, it seems to be subject to needing ~11ms to update.
  await aTimeout(100)

  entries = new FormData(form)
  assert.lengthOf(listbox.value.getAll("select"), 0)
  assert.lengthOf(entries.getAll("select"), 0)

  form.reset()

  await aTimeout(1)
  entries = new FormData(form)
  assert.lengthOf(listbox.value.getAll("select"), 3)
  assert.lengthOf(entries.getAll("select"), 3)
})

test("Should properly select and deselect all items", async () => {
  const form = await fixture(html`
    <form>
      <role-listbox multiple name="select" style="height: 200px;">
        <role-option selected value="1">Option 1</role-option>
        <role-option selected value="2">Option 2</role-option>
        <role-option selected value="3">Option 3</role-option>
        <role-option value="4">Option 4</role-option>
        <role-option value="5">Option 5</role-option>
        <role-option value="6">Option 6</role-option>
        <role-option value="7">Option 7</role-option>
        <role-option value="8">Option 8</role-option>
        <role-option value="9">Option 9</role-option>
        <role-option value="10">Option 10</role-option>
      </role-listbox>
    </form>
  `)

  const listbox = form.querySelector("role-listbox")

  let entries = new FormData(form)

  assert.lengthOf(entries.getAll("select"), 3)
  assert.lengthOf(listbox.value.getAll("select"), 3)
  listbox.selectAll()

  await aTimeout(1)

  entries = new FormData(form)
  assert.lengthOf(listbox.value.getAll("select"), 10)
  assert.lengthOf(entries.getAll("select"), 10)

  listbox.deselectAll()

  await waitUntil(() => listbox.selectedOptions.length === 0)

  entries = new FormData(form)
  assert.lengthOf(listbox.value.getAll("select"), 0)
  assert.lengthOf(entries.getAll("select"), 0)
})


test("Should submit the text content of option 1", async () => {
  const form = await fixture(html`
    <form>
      <role-listbox multiple name="select" style="height: 200px;">
        <role-option selected>Option 1</role-option>
      </role-listbox>
    </form>
  `)

  const listbox = form.querySelector("role-listbox")

  let entries = new FormData(form)

  assert.lengthOf(entries.getAll("select"), 1)
  assert.lengthOf(listbox.value.getAll("select"), 1)
  assert.equal(entries.get("select"), listbox.querySelector("role-option").textContent)
})

test("Should submit the text content of option 1", async () => {
  const form = await fixture(html`
    <form>
      <role-listbox name="select" style="height: 200px;">
        <role-option selected>Option 1</role-option>
      </role-listbox>
    </form>
  `)

  const listbox = form.querySelector("role-listbox")

  let entries = new FormData(form)

  assert.lengthOf(entries.getAll("select"), 1)
  assert.equal(listbox.value, listbox.querySelector("role-option").textContent)
  assert.equal(entries.get("select"), listbox.querySelector("role-option").textContent)
})

test("Should start at option 4 and move up / down from there", async () => {
  const form = await fixture(html`
    <form>
      <role-listbox name="select" style="height: 200px;">
        <role-option>Option 1</role-option>
        <role-option>Option 2</role-option>
        <role-option>Option 3</role-option>
        <role-option selected>Option 4</role-option>
        <role-option>Option 5</role-option>
      </role-listbox>
    </form>
  `)

  const listbox = form.querySelector("role-listbox")

  let entries = new FormData(form)

  assert.lengthOf(entries.getAll("select"), 1)
  assert.equal(listbox.value, listbox.querySelectorAll("role-option")[3].textContent)
  assert.equal(entries.get("select"), listbox.querySelectorAll("role-option")[3].textContent)

  assert.equal(listbox.currentOption, listbox.querySelectorAll("role-option")[3])

  // listbox.focus()
  // await aTimeout(10)
  // await sendKeys({ press: "ArrowDown" })
  // await aTimeout(10)

  // assert.equal(listbox.currentOption, listbox.querySelectorAll("role-option")[4])
  //
  // await aTimeout(10)
  // await sendKeys({ press: "ArrowUp" })
  // await sendKeys({ press: "ArrowUp" })
  // await aTimeout(10)
  //
  // assert.equal(listbox.currentOption, listbox.querySelectorAll("role-option")[2])
})
