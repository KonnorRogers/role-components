---
---

A default combobox is very similar to a `<select>`. It supports an "internal search buffer" where
you can change how long it takes to "reset" searching for options.

<role-combobox>
  <role-option>Honeybadger</role-option>
  <role-option>Rhino</role-option>
  <role-option>Badger mole</role-option>
  <role-option>Flamingo</role-option>
  <role-option>Tortoise</role-option>
  <role-option>Killer Whale</role-option>
  <role-option>Opossum</role-option>
</role-combobox>

## Setting a default selected value

<role-combobox>
  <role-option>Honeybadger</role-option>
  <role-option>Rhino</role-option>
  <role-option selected>Badger mole</role-option>
  <role-option>Flamingo</role-option>
  <role-option>Tortoise</role-option>
  <role-option>Killer Whale</role-option>
  <role-option>Opossum</role-option>
</role-combobox>

## Editable Combobox without autocomplete

<role-combobox autocomplete="off">
  <role-option>Honeybadger</role-option>
  <role-option>Rhino</role-option>
  <role-option>Badger mole</role-option>
  <role-option>Flamingo</role-option>
  <role-option>Tortoise</role-option>
  <role-option>Killer Whale</role-option>
  <role-option>Opossum</role-option>
</role-combobox>

## List Autocomplete Combobox

<role-combobox autocomplete="list">
  <role-option>Honeybadger</role-option>
  <role-option>Rhino</role-option>
  <role-option>Badger mole</role-option>
  <role-option>Flamingo</role-option>
  <role-option>Tortoise</role-option>
  <role-option>Killer Whale</role-option>
  <role-option>Opossum</role-option>
</role-combobox>

## Inline Autocomplete Combobox

<role-combobox autocomplete="inline">
  <role-option>Honeybadger</role-option>
  <role-option>Rhino</role-option>
  <role-option>Badger mole</role-option>
  <role-option>Flamingo</role-option>
  <role-option>Tortoise</role-option>
  <role-option>Killer Whale</role-option>
  <role-option>Opossum</role-option>
</role-combobox>

## Autocomplete List & Inline Combobox

<role-combobox autocomplete="both">
  <role-option>Honeybadger</role-option>
  <role-option>Rhino</role-option>
  <role-option>Badger mole</role-option>
  <role-option>Flamingo</role-option>
  <role-option>Tortoise</role-option>
  <role-option>Killer Whale</role-option>
  <role-option>Opossum</role-option>
</role-combobox>

## Filtering Results

When using autocomplete, you may want to filter results that don't match and only show matching results.

<role-combobox autocomplete="both" filter-results>
  <role-option>Honeybadger</role-option>
  <role-option>Rhino</role-option>
  <role-option>Badger mole</role-option>
  <role-option>Flamingo</role-option>
  <role-option>Tortoise</role-option>
  <role-option>Killer Whale</role-option>
  <role-option>Opossum</role-option>
</role-combobox>

## Multiple select comboboxes

Role Combobox supports "Multiple Select Comboboxes". Just like with the single select comboboxes above, it supports 3 different types of autocomplete.

<role-combobox multiple>
  <role-option>Honeybadger</role-option>
  <role-option>Rhino</role-option>
  <role-option>Badger mole</role-option>
  <role-option>Flamingo</role-option>
  <role-option>Tortoise</role-option>
  <role-option>Killer Whale</role-option>
  <role-option>Opossum</role-option>
</role-combobox>
