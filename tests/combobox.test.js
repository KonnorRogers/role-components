import { html, fixture, assert, aTimeout } from '@open-wc/testing';
import { sendKeys } from "@web/test-runner-commands"

const isiOS = /Mac|iOS|iPhone|iPad|iPod/i.test(
  window.navigator.platform,
);

import "../exports/components/combobox/combobox-register.js"
import "../exports/components/option/option-register.js"

// Single select
test("Should properly check items in the combobox", async () => {
  const form = await fixture(html`
    <form>
      <role-combobox name="combobox">
        <input slot="trigger">
        <div slot="options">
          <role-option>Option 1</role-option>
          <role-option>Option 2</role-option>
          <role-option>Option 3</role-option>
          <role-option>Option 4</role-option>
          <role-option>Option 5</role-option>
          <role-option>Option 6</role-option>
          <role-option>Option 7</role-option>
          <role-option>Option 8</role-option>
          <role-option>Option 9</role-option>
          <role-option>Option 10</role-option>
        </div>
      </role-combobox>
    </form>
  `)

  const combobox = form.querySelector("role-combobox")
  const options = () => form.querySelectorAll("role-option")

  const formData = () => new FormData(form)
  assert.equal(combobox.value, null)
  assert.lengthOf(formData().getAll("combobox"), 0)

  combobox.triggerElement.focus()

  await aTimeout(100)
  await sendKeys({ press: "ArrowDown" })
  await aTimeout(100)

  assert.equal(combobox.active, true)
  assert.equal(combobox.triggerElement.getAttribute("aria-expanded"), "true")

  assert.equal(options()[0].selected, false)
  assert.equal(options()[0].current, true)

  assert.equal(combobox.triggerElement.value, '')
  assert.equal(combobox.value, null)

  // Select the 1st option
  await aTimeout(10)
  await sendKeys({ press: "Enter" })
  await aTimeout(10)

  assert.equal(combobox.active, false)
  assert.equal(combobox.triggerElement.value, options()[0].value)
  assert.equal(combobox.value, options()[0].value)
  assert.lengthOf(formData().getAll("combobox"), 1)
  assert.equal(formData().getAll("combobox")[0], options()[0].innerText)

  assert.equal(options()[0].selected, true)
  assert.equal(options()[0].current, true)

  assert.equal(options()[1].selected, false)
  assert.equal(options()[1].current, false)

  await sendKeys({ press: "ArrowDown" }) // Expand the combobox
  assert.equal(combobox.active, true)

  await sendKeys({ press: "ArrowDown" }) // Focus the next option

  // double check we havent lost selection
  assert.equal(combobox.triggerElement.value, options()[0].innerText)
  assert.equal(combobox.value, options()[0].innerText)
  assert.lengthOf(formData().getAll("combobox"), 1)
  assert.equal(formData().getAll("combobox")[0], options()[0].innerText)

  assert.equal(options()[0].selected, true)
  assert.equal(options()[0].current, false)

  assert.equal(options()[1].selected, false)
  assert.equal(options()[1].current, true)

  // Select the option
  await aTimeout(100)
  await sendKeys({ press: "Enter" })
  await aTimeout(100)

  assert.equal(options()[0].selected, false)
  assert.equal(options()[0].current, false)

  assert.equal(options()[1].selected, true)
  assert.equal(options()[1].current, true)

  // Make sure we deselect previous.
  assert.equal(combobox.triggerElement.value, options()[1].innerText)
  assert.equal(combobox.value, options()[1].innerText)
  assert.lengthOf(formData().getAll("combobox"), 1)
  assert.equal(formData().getAll("combobox")[0], options()[1].innerText)
})

// Single select
test("Should properly selected the first selected item in the combobox", async () => {
  const form = await fixture(html`
    <form>
      <role-combobox name="combobox">
        <input slot="trigger">

        <div slot="options">
          <role-option value="1">Option 1</role-option>
          <role-option value="2">Option 2</role-option>
          <role-option value="3">Option 3</role-option>
          <role-option selected value="4">Option 4</role-option>
          <role-option selected value="5">Option 5</role-option>
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
  assert.equal(combobox.value, options()[3].value)
  assert.lengthOf(formData().getAll("combobox"), 1)

  combobox.focus()
  await aTimeout(10)
  await sendKeys({ press: "ArrowDown" })
  await aTimeout(10)

  assert.equal(combobox.active, true)
  assert.equal(combobox.triggerElement.getAttribute("aria-expanded"), "true")

  assert.equal(options()[3].selected, true)
  assert.equal(options()[3].current, true)

  assert.equal(options()[4].selected, false)
  assert.equal(options()[4].current, false)

  assert.equal(combobox.triggerElement.value, options()[3].innerText)
  assert.equal(combobox.value, options()[3].value)
})

// Multiple select delimiter separated
test("Should not included disabled options", async () => {
  const form = await fixture(html`
    <form>
      <role-combobox multiple name="combobox">
        <input slot="trigger">
        <div slot="options">
          <role-option value="1" disabled>Option 1</role-option>
          <role-option value="2">Option 2</role-option>
        </div>
      </role-combobox>
    </form>
  `)

  const combobox = form.querySelector("role-combobox")

  assert.lengthOf(combobox.options, 1)
})

// Multiple select formdata
test("Should properly selected the all selected items in the combobox", async () => {
  const form = await fixture(html`
    <form>
      <role-combobox multiple value-type="formdata" name="combobox">
        <input slot="trigger">

        <div slot="options">
          <role-option value="1">Option 1</role-option>
          <role-option value="2">Option 2</role-option>
          <role-option value="3">Option 3</role-option>
          <role-option selected value="4">Option 4</role-option>
          <role-option selected value="5">Option 5</role-option>
          <role-option value="6">Option 6</role-option>
          <role-option value="7">Option 7</role-option>
          <role-option value="8">Option 8</role-option>
          <role-option value="9">Option 9</role-option>
          <role-option value="10">Option 10</role-option>
        </div>
      </role-combobox>
    </form>
  `)

  await aTimeout(10)
  const combobox = form.querySelector("role-combobox")
  const options = () => form.querySelectorAll("role-option")

  const formData = () => new FormData(form)
  assert.lengthOf(formData().getAll("combobox"), 2)
  assert.lengthOf(combobox.value.getAll("combobox"), 2)
})

test("Should properly record a value for autocomplete='off'", async () => {
  const form = await fixture(html`
    <form>
      <role-combobox name="combobox" autocomplete="off">
        <input slot="trigger">
        <div slot="options">
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

  assert.equal(combobox.value, "4")
  assert.equal(combobox.triggerElement.value, "Option 4")

  combobox.triggerElement.value = ""
  combobox.focus()

  const str = "Option"

  for (const char of str) {
    combobox.focus()
    await aTimeout(10)
    await sendKeys({ press: char })
    await aTimeout(10)
  }

  // Input
  assert.equal(combobox.triggerElement.value, "Option")
  // Combobox itself
  assert.equal(combobox.value, "Option")

  await sendKeys({ press: "Backspace" })
  await aTimeout(20)

  // Input
  assert.equal(combobox.triggerElement.value, "Optio")
  // Combobox itself
  assert.equal(combobox.value, "Optio")
})

test("Should properly record a value for autocomplete='list'", async () => {
  const form = await fixture(html`
    <form>
      <role-combobox name="combobox" autocomplete="list">
        <input slot="trigger">
        <div slot="options">
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

  assert.equal(combobox.value, "4")
  assert.equal(combobox.triggerElement.value, "Option 4")

  combobox.triggerElement.value = ""
  combobox.focus()

  const str = "Option"

  await sendKeys({ type: str })
  await aTimeout(20)

  // Input
  assert.equal(combobox.triggerElement.value, "Option")
  // Combobox itself
  assert.equal(combobox.value, "Option")
  const options = () => combobox.querySelectorAll("[role='option']")
  assert.equal(options()[0].getAttribute("aria-current"), "true")
  assert.equal(combobox.getAttribute("aria-activedescendant", options()[0].id))

  await sendKeys({ press: "Backspace" })
  await aTimeout(20)

  // Input
  assert.equal(combobox.triggerElement.value, "Optio")
  // Combobox itself
  assert.equal(combobox.value, "Optio")
})


test("Should properly record a value for autocomplete='inline'", async () => {
  const form = await fixture(html`
    <form>
      <role-combobox name="combobox" autocomplete="inline">
        <input slot="trigger">
        <div slot="options">
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

  combobox.focus()

  const str = "Option"

  for (const char of str) {
    combobox.focus()
    await aTimeout(20)
    await sendKeys({ type: char })
    await aTimeout(20)
  }

  // Input
  assert.equal(combobox.triggerElement.value, "Option 1")
  // Combobox itself
  assert.equal(combobox.value, "1")

  await sendKeys({ press: "Backspace" })
  // await sendKeys({ press: "Backspace" })
  await aTimeout(20)

  // Input
  assert.equal(combobox.triggerElement.value, "Option")
  // Combobox itself
  assert.equal(combobox.value, "Option")
})

test("Should properly record a value for autocomplete='both'", async () => {
  const form = await fixture(html`
    <form>
      <role-combobox name="combobox" autocomplete="both">
        <input slot="trigger">
        <div slot="options">
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

  combobox.focus()

  const str = "Option"

  for (const char of str) {
    combobox.focus()
    await aTimeout(20)
    await sendKeys({ type: char })
    await aTimeout(20)
  }

  // Input
  assert.equal(combobox.triggerElement.value, "Option 1")
  // Combobox itself
  assert.equal(combobox.value, "1")

  await sendKeys({ press: "Backspace" })
  await aTimeout(20)

  // Input
  assert.equal(combobox.triggerElement.value, "Option")
  // Combobox itself
  assert.equal(combobox.value, "Option")
})

// Multiple select delimiter separated
test("Should properly selected the all selected items in the combobox", async () => {
  const form = await fixture(html`
    <form>
      <role-combobox multiple name="combobox">
        <input slot="trigger">

        <div slot="options">
          <role-option value="1">Option 1</role-option>
          <role-option value="2">Option 2</role-option>
          <role-option value="3">Option 3</role-option>
          <role-option selected value="4">Option 4</role-option>
          <role-option selected value="5">Option 5</role-option>
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
  assert.lengthOf(formData().getAll("combobox"), 1)
  assert.equal(formData().get("combobox"), "4, 5")
  assert.equal(combobox.value, "4, 5")
  assert.equal(combobox.triggerElement.value, "Option 4, Option 5")
})

test("Should change the delimiter when the delimiter attribute is changed", async () => {
  const combobox = await fixture(html`
    <role-combobox multiple delimiter=";" name="combobox">
      <input slot="trigger">
      <div slot="options">
        <role-option>Honeybadger</role-option>
        <role-option selected>Rhino</role-option>
        <role-option>Badger mole</role-option>
        <role-option>Flamingo</role-option>
        <role-option selected>Tortoise</role-option>
        <role-option>Killer Whale</role-option>
        <role-option>Opossum</role-option>
      </div>
    </role-combobox>
  `)

  await aTimeout(15)

  assert.equal(combobox.value, "Rhino; Tortoise")
  assert.equal(combobox.triggerElement.value, "Rhino; Tortoise")
})

test("Should properly manipulate and add / remove buttons and strings for an editable delimited combobox", async () => {
  const combobox = await fixture(html`
    <role-combobox multiple editable name="combobox">
      <input slot="trigger">
      <div slot="options">
        <role-option>Honeybadger</role-option>
        <role-option selected>Rhino</role-option>
        <role-option>Badger mole</role-option>
        <role-option>Flamingo</role-option>
        <role-option selected>Tortoise</role-option>
        <role-option>Killer Whale</role-option>
        <role-option>Opossum</role-option>
      </div>
    </role-combobox>
  `)

  await aTimeout(15)

  const selectedOptionsButtons = () => combobox.shadowRoot.querySelectorAll("[part~='selected-options'] button")
  assert.lengthOf(selectedOptionsButtons(), 2)
  assert.equal(combobox.value, "Rhino, Tortoise")
  assert.equal(combobox.triggerElement.value, "Rhino, Tortoise")

  combobox.triggerElement.focus()

  await aTimeout(100)
  await sendKeys({ press: "Backspace" })
  await aTimeout(100)
  await combobox.updateComplete

  assert.equal(selectedOptionsButtons().length, 2)
  assert.equal(combobox.value, "Rhino, Tortois")
  assert.equal(combobox.triggerElement.value, "Rhino, Tortois")

  await aTimeout(20)
  await sendKeys({ press: "e" })
  await aTimeout(20)

  assert.equal(selectedOptionsButtons().length, 2)
  assert.equal(combobox.value, "Rhino, Tortoise")
  assert.equal(combobox.triggerElement.value, "Rhino, Tortoise")

  const firstOption = combobox.querySelector("role-option")
  firstOption.click()

  await aTimeout(20)
  // Should not re-order value or buttons
  assert.equal(selectedOptionsButtons().length, 3)
  assert.equal(combobox.value, "Rhino, Tortoise, Honeybadger")
  assert.equal(combobox.triggerElement.value, "Rhino, Tortoise, Honeybadger")
})

test("Should properly manipulate and add / remove buttons and strings for an editable delimited combobox", async () => {
  const combobox = await fixture(html`
    <role-combobox multiple editable name="combobox">
      <input slot="trigger">
      <div slot="options">
        <role-option>Honeybadger</role-option>
        <role-option selected>Rhino</role-option>
        <role-option selected>Badger mole</role-option>
        <role-option selected>Flamingo</role-option>
        <role-option>Tortoise</role-option>
        <role-option>Killer Whale</role-option>
        <role-option>Opossum</role-option>
      </div>
    </role-combobox>
  `)

  await aTimeout(15)

  const selectedOptionsButtons = () => combobox.shadowRoot.querySelectorAll("[part~='selected-options'] button")
  assert.lengthOf(selectedOptionsButtons(), 3)
  assert.equal(combobox.value, "Rhino, Badger mole, Flamingo")
  assert.equal(combobox.triggerElement.value, "Rhino, Badger mole, Flamingo")

  selectedOptionsButtons()[1].click()

  await combobox.updateComplete

  assert.lengthOf(selectedOptionsButtons(), 2)
  assert.equal(combobox.value, "Rhino, Flamingo")
  assert.equal(combobox.triggerElement.value, "Rhino, Flamingo")

})

suite("Should properly remove all values when the triggerElement has everything deleted", async () => {
  const autocompleteTypes = ["off", "both", "inline", ""]

  for (const autocomplete of autocompleteTypes) {
    test(autocomplete, async () => {
      const combobox = await fixture(html`
        <role-combobox multiple editable name="combobox" autocomplete=${autocomplete}>
          <input slot="trigger">
          <div slot="options">
            <role-option>Honeybadger</role-option>
            <role-option selected>Rhino</role-option>
            <role-option selected>Badger mole</role-option>
            <role-option selected>Flamingo</role-option>
            <role-option>Tortoise</role-option>
            <role-option>Killer Whale</role-option>
            <role-option>Opossum</role-option>
          </div>
        </role-combobox>
      `)

      await aTimeout(15)

      assert.lengthOf(combobox.selectedOptions, 3)
      assert.equal(combobox.value, "Rhino, Badger mole, Flamingo")
      assert.equal(combobox.triggerElement.value, "Rhino, Badger mole, Flamingo")

      combobox.triggerElement.focus()

      if (isiOS) {
        // select all on macOS
        await sendKeys({ press: 'Meta+A' })
      } else {
        // select all on non-macOS
        await sendKeys({ press: 'Control+A' })
      }

      await sendKeys({ press: "Backspace" })

      await combobox.updateComplete

      assert.lengthOf(combobox.selectedOptions, 0)
      assert.equal(combobox.value, "")
      assert.equal(combobox.triggerElement.value, "")
    })
  }
})

suite("Multiple select combobox", () => {
  test("Should select options properly", async () => {
    const combobox = await fixture(html`
      <role-combobox multiple name="combobox">
        <input slot="trigger">
        <div slot="options">
          <role-option>Honeybadger</role-option>
          <role-option>Rhino</role-option>
          <role-option>Badger mole</role-option>
          <role-option>Flamingo</role-option>
          <role-option>Tortoise</role-option>
          <role-option>Killer Whale</role-option>
          <role-option>Opossum</role-option>
        </div>
      </role-combobox>
    `)

    combobox.focus()

    await sendKeys({ press: "ArrowDown" })
    await sendKeys({ press: "Enter" })

    const options = () => combobox.querySelectorAll("role-option")
    assert.equal(combobox.triggerElement.value, options()[0].textContent)
    assert.lengthOf(combobox.selectedOptions, 1)
    assert.equal(options()[0].selected, true)
  })

  test("filtering results + autocomplete='both'", async () => {
    const combobox = await fixture(html`
      <role-combobox name="combobox" autocomplete="both" filter-results>
        <input slot="trigger">
        <div slot="options">
          <role-option>Capybara</role-option>
          <role-option>Rhino</role-option>
          <role-option>Badger mole</role-option>
          <role-option>Flamingo</role-option>
          <role-option>Tortoise</role-option>
          <role-option>Killer Whale</role-option>
          <role-option>Opossum</role-option>
          <role-option>Turtle</role-option>
          <role-option>Elephant</role-option>
          <role-option>Dove</role-option>
          <role-option>Sparrow</role-option>
          <role-option>Platypus</role-option>
          <role-option>Zebra</role-option>
          <role-option>Dog</role-option>
          <role-option>Cat</role-option>
          <role-option>Swan</role-option>
          <role-option>Goose</role-option>
        </div>
      </role-combobox>
    `)

    combobox.triggerElement.focus()

    const str = "Ca"
    await sendKeys({ type: str })

    await aTimeout(10)

    assert.equal(combobox.selectedOptions[0].content, "Capybara")

    // We should have "Capybara" preselected, and "Cat" under it.
    await sendKeys({ press: "ArrowDown" }) // Scroll down to "Cat" option

    // Select it with Keyboard.
    await sendKeys({ press: "Enter" }) // Scroll down to "Cat" option

    // assert.equal(combobox.selectedOptions[0].content, "Cat")
  })
})

suite("Multiple editable combobox", async () => {

  test("autocomplete='' > Should maintain order of selected options", async () => {
    const combobox = await fixture(html`
      <role-combobox multiple editable name="combobox">
        <input slot="trigger">
        <div slot="options">
          <role-option>Honeybadger</role-option>
          <role-option>Rhino</role-option>
          <role-option>Badger mole</role-option>
          <role-option>Flamingo</role-option>
          <role-option>Tortoise</role-option>
          <role-option>Killer Whale</role-option>
          <role-option>Opossum</role-option>
        </div>
      </role-combobox>
    `)

    combobox.triggerElement.focus()

    const str = "Blah, Honeybadge"
    await sendKeys({ type: str })

    assert.lengthOf(combobox.selectedOptions, 2)
    assert.equal(combobox.selectedOptions[0].content, "Blah")
    assert.equal(combobox.selectedOptions[1].content, "Honeybadge")
  })

  test("autocomplete='off' > Should maintain order of selected options", async () => {
    const combobox = await fixture(html`
      <role-combobox multiple editable name="combobox">
        <input slot="trigger">
        <div slot="options">
          <role-option>Honeybadger</role-option>
          <role-option>Rhino</role-option>
          <role-option>Badger mole</role-option>
          <role-option>Flamingo</role-option>
          <role-option>Tortoise</role-option>
          <role-option>Killer Whale</role-option>
          <role-option>Opossum</role-option>
        </div>
      </role-combobox>
    `)

    combobox.triggerElement.focus()

    const str = "Blah, Honeybadge"
    await sendKeys({ type: str })

    assert.lengthOf(combobox.selectedOptions, 2)
    assert.equal(combobox.selectedOptions[0].content, "Blah")
    assert.equal(combobox.selectedOptions[1].content, "Honeybadge")
  })

  test("autocomplete='inline' > Should maintain order of selected options", async () => {
    const combobox = await fixture(html`
      <role-combobox multiple name="combobox" autocomplete="inline">
        <input slot="trigger">
        <div slot="options">
          <role-option>Honeybadger</role-option>
          <role-option>Rhino</role-option>
          <role-option>Badger mole</role-option>
          <role-option>Flamingo</role-option>
          <role-option>Tortoise</role-option>
          <role-option>Killer Whale</role-option>
          <role-option>Opossum</role-option>
        </div>
      </role-combobox>
    `)

    combobox.triggerElement.focus()

    const str = "Blah, Honeybadge"
    await sendKeys({ type: str })

    assert.lengthOf(combobox.selectedOptions, 2)
    assert.isTrue(combobox.querySelectorAll("role-option")[0].selected)
    assert.equal(combobox.selectedOptions[0].content, "Blah")
    assert.equal(combobox.selectedOptions[1].content, "Honeybadger")
    assert.equal(combobox.triggerElement.value, "Blah, Honeybadger")
  })

  test("Both > Should maintain order of selected options", async () => {
    const combobox = await fixture(html`
      <role-combobox multiple name="combobox" autocomplete="both">
        <input slot="trigger">
        <div slot="options">
          <role-option>Honeybadger</role-option>
          <role-option>Rhino</role-option>
          <role-option>Badger mole</role-option>
          <role-option>Flamingo</role-option>
          <role-option>Tortoise</role-option>
          <role-option>Killer Whale</role-option>
          <role-option>Opossum</role-option>
        </div>
      </role-combobox>
    `)

    combobox.triggerElement.focus()

    const str = "Blah, Honeybadge"
    await sendKeys({ type: str })

    assert.lengthOf(combobox.selectedOptions, 2)
    assert.isTrue(combobox.querySelectorAll("role-option")[0].selected)
    assert.equal(combobox.selectedOptions[0].content, "Blah")
    assert.equal(combobox.selectedOptions[1].content, "Honeybadger")
    assert.equal(combobox.triggerElement.value, "Blah, Honeybadger")
  })

  test("autocomplete='inline' > Should remove auto selected option on backspace", async () => {
    const combobox = await fixture(html`
      <role-combobox multiple name="combobox" autocomplete="inline">
        <input slot="trigger">
        <div slot="options">
          <role-option>Honeybadger</role-option>
          <role-option>Rhino</role-option>
          <role-option>Badger mole</role-option>
          <role-option>Flamingo</role-option>
          <role-option>Tortoise</role-option>
          <role-option>Killer Whale</role-option>
          <role-option>Opossum</role-option>
        </div>
      </role-combobox>
    `)

    combobox.triggerElement.focus()

    const str = "Honeybadge"
    await sendKeys({ type: str })

    assert.isTrue(combobox.querySelectorAll("role-option")[0].selected)
    assert.lengthOf(combobox.selectedOptions, 1)
    assert.equal(combobox.selectedOptions[0].content, "Honeybadger")
    await sendKeys({ press: "Backspace" })

    assert.isFalse(combobox.querySelectorAll("role-option")[0].selected)
    assert.lengthOf(combobox.selectedOptions, 1)
    assert.equal(combobox.selectedOptions[0].content, "Honeybadge")

    await sendKeys({ press: "Backspace" })

    assert.isFalse(combobox.querySelectorAll("role-option")[0].selected)
    assert.lengthOf(combobox.selectedOptions, 1)
    assert.equal(combobox.selectedOptions[0].content, "Honeybadg")
  })

  test("autocomplete='both' > Should remove auto selected option on backspace", async () => {
    const combobox = await fixture(html`
      <role-combobox multiple name="combobox" autocomplete="both">
        <input slot="trigger">
        <div slot="options">
          <role-option>Honeybadger</role-option>
          <role-option>Rhino</role-option>
          <role-option>Badger mole</role-option>
          <role-option>Flamingo</role-option>
          <role-option>Tortoise</role-option>
          <role-option>Killer Whale</role-option>
          <role-option>Opossum</role-option>
        </div>
      </role-combobox>
    `)

    combobox.triggerElement.focus()

    const str = "Honeybadge"
    await sendKeys({ type: str })

    assert.isTrue(combobox.querySelectorAll("role-option")[0].selected)
    assert.lengthOf(combobox.selectedOptions, 1)
    assert.equal(combobox.selectedOptions[0].content, "Honeybadger")
    await sendKeys({ press: "Backspace" })

    assert.isFalse(combobox.querySelectorAll("role-option")[0].selected)
    assert.lengthOf(combobox.selectedOptions, 1)
    assert.equal(combobox.selectedOptions[0].content, "Honeybadge")

    await sendKeys({ press: "Backspace" })

    assert.isFalse(combobox.querySelectorAll("role-option")[0].selected)
    assert.lengthOf(combobox.selectedOptions, 1)
    assert.equal(combobox.selectedOptions[0].content, "Honeybadg")
  })

  test("`multiple-selection-type='manual' should append newly selected options`", async () => {
    const combobox = await fixture(html`
      <role-combobox multiple="" editable="" multiple-selection-type="manual" autocomplete="both" name="combobox">
        <input slot="trigger">
        <div slot="options">
          <role-option>Honeybadger</role-option>
          <role-option selected="">Killer Whale</role-option>
          <role-option>Opossum</role-option>
        </div>
      </role-combobox>
    `)

    // Initial state should have a cleared combobox.
    assert.equal(combobox.querySelector("[slot='trigger']").value, "")

    const options = () => combobox.querySelectorAll("role-option")

    // Default selected is Killer Whale
    assert.isFalse(options()[0].selected)
    assert.isTrue(options()[1].selected)
    assert.isFalse(options()[2].selected)
    assert.lengthOf(combobox.selectedOptions, 1)
    assert.equal(combobox.selectedOptions[0].content, "Killer Whale")

    combobox.triggerElement.focus()

    const str = "Honeybadge"
    await sendKeys({ type: str })

    await sendKeys({ press: "Enter" })

    assert.lengthOf(combobox.selectedOptions, 2)

    // Maintain old selected option, and append.
    assert.isTrue(options()[1].selected)
    assert.equal(combobox.selectedOptions[0].content, "Killer Whale")

    assert.isTrue(options()[0].selected)
    assert.equal(combobox.selectedOptions[1].content, options()[0].innerText)

    assert.isFalse(options()[2].selected)
  })

  test("`multiple-selection-type='manual' should append newly selected options`", async () => {
    const combobox = await fixture(html`
      <role-combobox name="combobox" autocomplete="both" filter-results="">
        <input slot="trigger">
        <div slot="options">
          <role-option>Capybara</role-option>
          <role-option>Cat</role-option>
        </div>
      </role-combobox>
    `)

    // Initial state should have a cleared combobox.
    const input = combobox.querySelector("[slot='trigger']")
    assert.equal(input.value, "")

    const options = () => combobox.querySelectorAll("role-option")

    input.focus()
    const str = "Ca"
    for (let i = 0; i < str.length; i++) {
      await aTimeout(10)
      await sendKeys({ type: str[i] })
      await aTimeout(10)
    }

    assert.equal(input.value, "Capybara")
    assert.equal(options()[0].getAttribute("aria-selected"), "true")
    assert.equal(options()[0].getAttribute("aria-current"), "true")

    await sendKeys({ press: "ArrowDown" })
    assert.equal(options()[0].getAttribute("aria-selected"), "true")
    assert.isFalse(options()[0].hasAttribute("aria-current"))

    assert.isFalse(options()[1].hasAttribute("aria-selected"))
    assert.equal(options()[1].getAttribute("aria-current"), "true")

    // Should select "Cat" and not "Capybara"
    await sendKeys({ press: "Enter" })

    assert.isFalse(options()[0].hasAttribute("aria-selected"))
    assert.isFalse(options()[0].hasAttribute("aria-current"))

    assert.equal(options()[1].getAttribute("aria-selected"), "true")
    assert.equal(options()[1].getAttribute("aria-current"), "true")
  })
})


