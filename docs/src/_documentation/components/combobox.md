---
---

A default combobox is very similar to a `<select>`. It supports an "internal search buffer" where
you can change how long it takes to "reset" searching for options.

<script type="module">
  // setInterval(() => {
  //   document.querySelector("[slot='listbox']")
  //     .append(
  //       Object.assign(
  //         document.createElement("role-option"),
  //         { textContent: "Option X" }
  //       )
  //     )
  // }, 2000)
</script>

<role-combobox hidden></role-combobox>
<role-option hidden></role-option>

<% debug_info = capture do %>
    <style>
      pre {
        background-color: rgb(250, 250, 250);
        padding: 1rem;
        color: rgb(56, 58, 66);
        overflow: auto;
      }
    </style>
    <br>
    URL Encoded:
    <pre tabindex="-1"><code id="url-encoded"></code></pre>
    <br>
    Form Data:
    <br>
    <light-code wrap="hard" language="js" id="form-data"><script type="text/plain" slot="code"></script></light-code>
    <br>
    <script type="module">
      function showFormData () {
        const formDataToObject = (formData) => {
          return Object.fromEntries(
            Array.from(formData.keys()).map(key => [
              key,
              formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)
            ])
          )
        }
        const formData = new FormData(document.querySelector("form"))
        const obj = formDataToObject(formData)
        const json = JSON.stringify(obj, null, 2)

        const urlEncoded = []
        for (const [key, value] of formData.entries()) {
          urlEncoded.push(encodeURIComponent(key) + "=" + encodeURIComponent(value))
        }

        document.querySelector("#url-encoded").innerText = urlEncoded.length ? "?" + urlEncoded.join("&") : ""
        // document.querySelector("#form-data").innerText = json
        document.querySelector("#form-data").code = json
      }

      ;(async () => {
        await window.customElements.whenDefined("role-combobox")
        setTimeout(() => {
          showFormData()
        })
      })()

      document.addEventListener("change", (e) => {
        showFormData()
      })

      // document.addEventListener("role-deselected", (e) => {
      //   showFormData()
      // })


      document.addEventListener("submit", (e) => {
        e.preventDefault()
        showFormData()
      })
    </script>
<% end.chomp.html_safe %>

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox name="combobox">
        <input slot="trigger" autocomplete="off">
        <div slot="listbox">
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
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= debug_info %>
  </template>
</light-preview>

## Setting a default selected value and using a button as the trigger

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox name="combobox">
        <button slot="trigger" style="padding: 0.4em 0.6em;"></button>
        <div slot="listbox">
          <role-option>Capybara</role-option>
          <role-option>Rhino</role-option>
          <role-option>Badger mole</role-option>
          <role-option>Flamingo</role-option>
          <role-option>Tortoise</role-option>
          <role-option selected>Killer Whale</role-option>
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
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= debug_info %>
  </template>
</light-preview>

## Editable Combobox without autocomplete

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox name="combobox" autocomplete="off">
        <input slot="trigger">
        <div slot="listbox">
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
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= debug_info %>
  </template>
</light-preview>

## List Autocomplete Combobox

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox name="combobox" autocomplete="list">
        <input slot="trigger">
        <div slot="listbox">
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
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= debug_info %>
  </template>
</light-preview>

## Inline Autocomplete Combobox

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox name="combobox" autocomplete="inline">
        <input slot="trigger">
        <div slot="listbox">
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
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= debug_info %>
  </template>
</light-preview>

## Autocomplete List & Inline Combobox

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox name="combobox" autocomplete="both">
        <input slot="trigger">
        <div slot="listbox">
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
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= debug_info %>
  </template>
</light-preview>

## Filtering Results

When using autocomplete, you may want to filter results that don't match and only show matching results.

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox name="combobox" autocomplete="both" filter-results>
        <input slot="trigger">
        <div slot="listbox">
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
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= debug_info %>
  </template>
</light-preview>

## Disabling options

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox name="combobox">
        <input slot="trigger">
        <div slot="listbox">
          <role-option disabled>Capybara</role-option>
          <role-option>Rhino</role-option>
          <role-option>Badger mole</role-option>
          <role-option disabled>Flamingo</role-option>
          <role-option>Tortoise</role-option>
          <role-option>Killer Whale</role-option>
          <role-option>Opossum</role-option>
          <role-option>Turtle</role-option>
          <role-option>Elephant</role-option>
          <role-option>Dove</role-option>
          <role-option disabled>Sparrow</role-option>
          <role-option>Platypus</role-option>
          <role-option>Zebra</role-option>
          <role-option>Dog</role-option>
          <role-option>Cat</role-option>
          <role-option>Swan</role-option>
          <role-option disabled>Goose</role-option>
        </div>
      </role-combobox>
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= debug_info %>
  </template>
</light-preview>

## Multiple select comboboxes

Role Combobox supports "Multiple Select Comboboxes". Just like with the single select comboboxes above, it supports 3 different types of autocomplete.

## Default multiple select comboboxes

Comboboxes by default will use a space delimited value to submit. To enable a multi-select combobox,
add the `multiple` attribute.

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox multiple name="combobox">
        <input slot="trigger">
        <div slot="listbox">
          <role-option>Honeybadger</role-option>
          <role-option selected>Rhino</role-option>
          <role-option>Badger mole</role-option>
          <role-option>Flamingo</role-option>
          <role-option selected>Tortoise</role-option>
          <role-option>Killer Whale</role-option>
          <role-option>Opossum</role-option>
        </div>
      </role-combobox>
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= debug_info %>
  </template>
</light-preview>

## Changing the delimiter of the combobox

By default, the combobox has a `, ` delimited value. If you want to change this, change the `"delimiter"` attribute.

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox multiple delimiter="; " name="combobox">
        <input slot="trigger">
        <div slot="listbox">
          <role-option>Honeybadger</role-option>
          <role-option selected>Rhino</role-option>
          <role-option>Badger mole</role-option>
          <role-option>Flamingo</role-option>
          <role-option selected>Tortoise</role-option>
          <role-option>Killer Whale</role-option>
          <role-option>Opossum</role-option>
        </div>
      </role-combobox>
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= debug_info %>
  </template>
</light-preview>

## Submitting all values instead of a single value

By default, the combobox will submit a single string-delimited value. This may not always be desirable. To
use `FormData` and submit multiple parameters based on the options selected, change the `value-type` attribute to `"formdata"`

<%= render Alert.new(type: :warning) do %>
Make sure to add a `name` attribute to the combobox to get the FormData to work properly.
<% end %>

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox multiple value-type="formdata" name="combobox">
        <input slot="trigger">
        <div slot="listbox">
          <role-option>Honeybadger</role-option>
          <role-option selected>Rhino</role-option>
          <role-option>Badger mole</role-option>
          <role-option>Flamingo</role-option>
          <role-option selected>Tortoise</role-option>
          <role-option>Killer Whale</role-option>
          <role-option>Opossum</role-option>
        </div>
      </role-combobox>
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= debug_info %>
  </template>
</light-preview>

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox multiple autocomplete="both" name="combobox">
        <input slot="trigger">
        <div slot="listbox">
          <role-option>Honeybadger</role-option>
          <role-option selected>Rhino</role-option>
          <role-option>Badger mole</role-option>
          <role-option>Flamingo</role-option>
          <role-option selected>Tortoise</role-option>
          <role-option>Killer Whale</role-option>
          <role-option>Opossum</role-option>
        </div>
      </role-combobox>
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= debug_info %>
  </template>
</light-preview>
