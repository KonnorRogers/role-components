---
---

## Things left to do:

- [ ] - Sorting (Hard because of streamed / injected elements, so we never fully know when we're done)
- [ ] - Virtualization (Most likely in a separate component)
- [ ] - Tag only UI like TomSelect, instead of the current multiple editable UI, create a UI like Tom Select where you "inject" a placeholder option that can be selected.

A default combobox is very similar to a `<select>`. It supports an "internal search buffer" where
you can change how long it takes to "reset" searching for options.

<role-combobox hidden></role-combobox>
<role-option hidden></role-option>

## Multi Select Examples

## Single Select Editable Combobox Examples

### Using a "manual" selection type + `allow-custom-values` for multi-select.

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox
        multiple
        editable
        multiple-selection-type="manual"
        allow-custom-values
        filter-results=""
        autocomplete="both"
        name="combobox"
      >
        <input slot="trigger">
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
      </role-combobox>
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-combobox") %>
  </template>
</light-preview>


### Using a "manual" selection type for multiple selection with filtering

There are 2 types of `multiple-selection-type`s. `automatic`, which is the default, and `manual`, which requires manually
selecting the option and will not automatically add it to the list of selected options.

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox multiple editable multiple-selection-type="manual" filter-results="" autocomplete="both" name="combobox">
        <input slot="trigger">
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
      </role-combobox>
      <br>
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-combobox") %>
  </template>
</light-preview>


## Editable Combobox without autocomplete

A combobox with `autocomplete="off"` is editable, but will not guide the user along the popup list
of options and will not prefill the input.

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox name="combobox" autocomplete="off">
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
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-combobox") %>
  </template>
</light-preview>

## List Autocomplete Combobox

"list" autocomplete will show the list and guide the user to the item in the list based
on the string provided in the input.

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox name="combobox" autocomplete="list">
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
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-combobox") %>
  </template>
</light-preview>

## Inline Autocomplete Combobox

Inline autocomplete will prefill the closest match for the user.

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox name="combobox" autocomplete="inline">
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
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-combobox") %>
  </template>
</light-preview>

## Autocomplete List & Inline Combobox

A list + inline ("both") combobox will both highlight the value in the input and select the item in the combobox list.

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox name="combobox" autocomplete="both">
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
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-combobox") %>
  </template>
</light-preview>

## Filtering Results

When using autocomplete, you may want to filter results that don't match and only show matching results.

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
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
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-combobox") %>
  </template>
</light-preview>

## Disabling options

Options can be disabled by passing the `disabled` attribute to the `<role-option>` element.

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox name="combobox">
        <input slot="trigger">
        <div slot="options">
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
    <%= render DebugInfo.new("role-combobox") %>
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
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-combobox") %>
  </template>
</light-preview>

## Changing the delimiter of the combobox

By default, the combobox has a `, ` delimited value. If you want to change this, change the `"delimiter"` attribute.

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox multiple delimiter="; " name="combobox">
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
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-combobox") %>
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
      <span>Multiple select-only combobox with no autocomplete and an value type of "formdata"</span>
      <role-combobox multiple value-type="formdata" name="combobox">
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
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-combobox") %>
  </template>
</light-preview>

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <label>
        <span>Editable multiple combobox with autocomplete of "both" with an value type of "formdata"</span>
        <br>
        <role-combobox multiple editable value-type="formdata" name="combobox">
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
      </label>
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-combobox") %>
  </template>
</light-preview>

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <label>
        <span>Editable multiple combobox with autocomplete of "both"</span>
        <br>
        <role-combobox multiple autocomplete="both" name="combobox">
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
      </label>
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-combobox") %>
  </template>
</light-preview>

### Editable Multi select combobox with autocomplete "both"

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox name="combobox">
        <input slot="trigger" autocomplete="both">
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
      </role-combobox>
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-combobox") %>
  </template>
</light-preview>

### Editable Multi select combobox with filtered results

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox multiple name="combobox" autocomplete="both">
        <input slot="trigger">
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
      </role-combobox>
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-combobox") %>
  </template>
</light-preview>


### Editable Multi select combobox with autocomplete "off"

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox multiple name="combobox" autocomplete="off">
        <input slot="trigger">
        <div slot="options">
          <role-option>Capybara</role-option>
          <role-option>Rhino</role-option>
          <role-option selected>Badger mole</role-option>
          <role-option selected>Flamingo</role-option>
          <role-option selected>Tortoise</role-option>
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
    <%= render DebugInfo.new("role-combobox") %>
  </template>
</light-preview>

### Editable Multi select combobox with filtering

<light-preview preview-mode="shadow-dom" script-scope="shadow-dom">
  <template slot="code">
    <form>
      <role-combobox multiple name="combobox" autocomplete="both">
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
      <br>
      <button type="reset">Reset</button>
    </form>
    <%= render DebugInfo.new("role-combobox") %>
  </template>
</light-preview>


