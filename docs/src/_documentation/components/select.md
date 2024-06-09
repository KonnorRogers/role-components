---
---

<role-select hidden></role-select>
<role-option hidden></role-option>

## Single Select Examples

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-select name="select">
        <input readonly slot="trigger" style="padding: 0.4em 0.6em;"></input>
        <div slot="options">
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
      </role-select>
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-select") %>
  </template>
</light-preview>

### Setting a default selected value

Setting a default selected `<role-option>` is done by adding the `selected` attribute.
This will also set `defaultSelected` so when the `<role-select>` resets, the option will reset as well.

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-select name="select">
        <input type="readonly" slot="trigger" type="button" style="padding: 0.4em 0.6em;">
        <div slot="options">
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
      </role-select>
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-select") %>
  </template>
</light-preview>

### Using a button as a trigger

A `<button>` can be passed in as the trigger for the select if you'd prefer. Make sure to set `type="button"`.

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <style>
      [slot="trigger"] {
        padding: 0.6em;
        font-size: 1em;
      }
    </style>
    <form>
      <role-select name="select">
        <button slot="trigger" type="button"></button>
        <div slot="options">
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
      </role-select>
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-select") %>
  </template>
</light-preview>

### Rendering Links in your select

Sometimes you want to use links in your select, rather than using click listeners to navigate a user,
we can pass in `href` attribute to `<role-option>` to render an `<a>` tag under the hood.

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-select name="select">
        <input slot="trigger">
        <div slot="options">
          <role-option href="#">Capybara</role-option>
          <role-option href="#">Rhino</role-option>
          <role-option href="#">Badger mole</role-option>
          <role-option href="#">Flamingo</role-option>
          <role-option selected>Tortoise</role-option>
          <role-option href="#">Killer Whale</role-option>
          <role-option href="#">Opossum</role-option>
          <role-option href="#">Turtle</role-option>
          <role-option href="#">Elephant</role-option>
          <role-option href="#">Dove</role-option>
          <role-option href="#">Sparrow</role-option>
          <role-option href="#">Platypus</role-option>
          <role-option href="#">Zebra</role-option>
          <role-option href="#">Dog</role-option>
          <role-option href="#">Cat</role-option>
          <role-option href="#">Swan</role-option>
          <role-option href="#">Goose</role-option>
        </div>
      </role-select>
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-select") %>
  </template>
</light-preview>

### Required Form Validation

Form validations for `<role-select>` currently only support the `required` attribute. Translations are handled for you by creating a hidden `<select>` with a `required` attribute.

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-select
        required
        name="select"
      >
        <input readonly slot="trigger">
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
      </role-select>
      <br><br><br>
      <button>Trigger Validations</button>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-select") %>
  </template>
</light-preview>

## Multiple select examples

Role Combobox supports "Multiple Select Comboboxes". Just like with the single select selectes above, it supports 3 different types of autocomplete.

Comboboxes by default will use a space delimited value to submit. To enable a multi-select select,
add the `multiple` attribute.

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-select multiple name="select">
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
      </role-select>
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-select") %>
  </template>
</light-preview>

### Changing the delimiter of the select

By default, the select has a `, ` delimited value. If you want to change this, change the `"delimiter"` attribute.

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-select multiple delimiter="; " name="select">
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
      </role-select>
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-select") %>
  </template>
</light-preview>

### Submitting all values instead of a single delimited string

By default, the select will submit a single string-delimited value. This may not always be desirable. To
use `FormData` and submit multiple parameters based on the options selected, change the `value-type` attribute to `"formdata"`

<%= render Alert.new(type: :warning) do %>
Make sure to add a `name` attribute to the select to get the FormData to work properly.
<% end %>

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <span>Multiple select-only select with no autocomplete and a value type of <mark>"formdata"</mark></span>
      <role-select multiple value-type="formdata" name="select">
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
      </role-select>
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-select") %>
  </template>
</light-preview>


