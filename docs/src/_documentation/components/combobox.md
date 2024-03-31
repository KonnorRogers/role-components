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

<light-preview preview-mode="shadow-dom">
  <template slot="code">
    <role-combobox>
      <input slot="trigger">
      <div slot="listbox" role="listbox">
        <role-option>Capybara</role-option>
        <role-option>Rhino</role-option>
        <role-option>Badger mole</role-option>
        <role-option>Flamingo</role-option>
        <role-option>Tortoise</role-option>
        <role-option>Killer Whale</role-option>
        <role-option>Opossum</role-option>
      </div>
    </role-combobox>
  </template>
</light-preview>

## Setting a default selected value and using a button as the trigger

<light-preview preview-mode="shadow-dom">
  <template slot="code">
    <role-combobox>
      <button slot="trigger" style="padding: 0.4em 0.6em;"></button>
      <div slot="listbox">
        <role-option>Honeybadger</role-option>
        <role-option>Rhino</role-option>
        <role-option selected>Badger mole</role-option>
        <role-option>Flamingo</role-option>
        <role-option>Tortoise</role-option>
        <role-option>Killer Whale</role-option>
        <role-option>Opossum</role-option>
      </div>
    </role-combobox>
  </template>
</light-preview>

## Editable Combobox without autocomplete

<light-preview preview-mode="shadow-dom">
  <template slot="code">
    <role-combobox autocomplete="off">
      <input slot="trigger">
      <div slot="listbox">
        <role-option>Honeybadger</role-option>
        <role-option>Rhino</role-option>
        <role-option>Badger mole</role-option>
        <role-option>Flamingo</role-option>
        <role-option>Tortoise</role-option>
        <role-option>Killer Whale</role-option>
        <role-option>Opossum</role-option>
      </div>
    </role-combobox>
  </template>
</light-preview>

## List Autocomplete Combobox

<light-preview preview-mode="shadow-dom">
  <template slot="code">
    <role-combobox autocomplete="list">
      <input slot="trigger">
      <div slot="listbox">
        <role-option>Honeybadger</role-option>
        <role-option>Rhino</role-option>
        <role-option>Badger mole</role-option>
        <role-option>Flamingo</role-option>
        <role-option>Tortoise</role-option>
        <role-option>Killer Whale</role-option>
        <role-option>Opossum</role-option>
      </div>
    </role-combobox>
  </template>
</light-preview>

## Inline Autocomplete Combobox

<light-preview preview-mode="shadow-dom">
  <template slot="code">
    <role-combobox autocomplete="inline">
      <input slot="trigger">
      <div slot="listbox">
        <role-option>Honeybadger</role-option>
        <role-option>Rhino</role-option>
        <role-option>Badger mole</role-option>
        <role-option>Flamingo</role-option>
        <role-option>Tortoise</role-option>
        <role-option>Killer Whale</role-option>
        <role-option>Opossum</role-option>
      </div>
    </role-combobox>
  </template>
</light-preview>

## Autocomplete List & Inline Combobox

<light-preview preview-mode="shadow-dom">
  <template slot="code">
    <role-combobox autocomplete="both">
      <input slot="trigger">
      <div slot="listbox">
        <role-option>Honeybadger</role-option>
        <role-option>Rhino</role-option>
        <role-option>Badger mole</role-option>
        <role-option>Flamingo</role-option>
        <role-option>Tortoise</role-option>
        <role-option>Killer Whale</role-option>
        <role-option>Opossum</role-option>
      </div>
    </role-combobox>
  </template>
</light-preview>

## Filtering Results

When using autocomplete, you may want to filter results that don't match and only show matching results.

<light-preview preview-mode="shadow-dom">
  <template slot="code">
    <role-combobox autocomplete="both" filter-results>
      <input slot="trigger">
      <div slot="listbox">
        <role-option>Honeybadger</role-option>
        <role-option>Rhino</role-option>
        <role-option>Badger mole</role-option>
        <role-option>Flamingo</role-option>
        <role-option>Tortoise</role-option>
        <role-option>Killer Whale</role-option>
        <role-option>Opossum</role-option>
      </div>
    </role-combobox>
  </template>
</light-preview>

## Disabling options

<light-preview preview-mode="shadow-dom">
  <template slot="code">
    <role-combobox>
      <input slot="trigger">
      <div slot="listbox">
        <role-option disabled>Honeybadger</role-option>
        <role-option>Rhino</role-option>
        <role-option disabled>Badger mole</role-option>
        <role-option>Flamingo</role-option>
        <role-option>Tortoise</role-option>
        <role-option>Killer Whale</role-option>
        <role-option disabled>Opossum</role-option>
      </div>
    </role-combobox>
  </template>
</light-preview>

## Multiple select comboboxes

Role Combobox supports "Multiple Select Comboboxes". Just like with the single select comboboxes above, it supports 3 different types of autocomplete.

<light-preview preview-mode="shadow-dom">
  <template slot="code">
    <role-combobox multiple>
      <input slot="trigger">
      <div slot="listbox">
        <role-option>Honeybadger</role-option>
        <role-option>Rhino</role-option>
        <role-option>Badger mole</role-option>
        <role-option>Flamingo</role-option>
        <role-option>Tortoise</role-option>
        <role-option>Killer Whale</role-option>
        <role-option>Opossum</role-option>
      </div>
    </role-combobox>
  </template>
</light-preview>

