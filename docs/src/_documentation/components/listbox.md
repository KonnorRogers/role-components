---
---

<light-preview preview-mode="shadow-dom">
  <template slot="code">
    <form>
      <role-listbox style="height: 200px;">
        <role-option selected value="1">Option 1</role-option>
        <role-option value="2">Option 2</role-option>
        <role-option value="3">Option 3</role-option>
        <role-option value="4">Option 4</role-option>
        <role-option value="5">Option 5</role-option>
        <role-option value="6">Option 6</role-option>
        <role-option value="7">Option 7</role-option>
        <role-option value="8">Option 8</role-option>
        <role-option value="9">Option 9</role-option>
        <role-option value="10">Option 10</role-option>
        <role-option value="Flamingo">Flamingo</role-option>
      </role-listbox>
    </form>
  </template>
</light-preview>

## Description

This is a listbox! It supports:

- Multi-select
- Typeahead
- Managed focus via aria-activedescendant
- And pretty much everything in the W3C listbox spec

It follows the spec for a listbox described here: <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>

## Keyboard Support

### Single Select

When a single-select listbox receives focus:

- If none of the options are selected before the listbox receives focus, the first option does not receive focus. The first option is not automatically selected.
- If an option is selected before the listbox receives focus, focus is set on the selected option.

- <kbd>Down Arrow</kbd>: Moves focus to the next option. Selection moves with focus.
- <kbd>Up Arrow</kbd>: Moves focus to the previous option. Selection moves with focus.
- <kbd>Home</kbd>: Moves focus to first option. Selection moves with focus.
- <kbd>End</kbd>: Moves focus to last option. Selection moves with focus.

### Multi Select

When a multi-select listbox receives focus:

- If none of the options are selected before the listbox receives focus, focus is set on the first option and there is no automatic change in the selection state.
- If one or more options are selected before the listbox receives focus, focus is set on the first option in the list that is selected.

<%= render Alert.new(type: "info") do %>
  The keyboard shortcuts supported in a single select listbox are also supported in a multi-select listbox.

  The <kbd>Control</kbd> key and <kbd>Command</kbd> behave the same on MacOS.
<% end %>

- <kbd>Space</kbd>: changes the selection state of the focused option.
- <kbd>Shift + Down Arrow</kbd>: Moves focus to and toggles the selected state of the next option. Also works like a range.
- <kbd>Shift + Up Arrow</kbd>: Moves focus to and toggles the selected state of the previous option. Also works like a range.
- <kbd>Shift + Space</kbd>: Selects contiguous items from the most recently selected item to the focused item.
- <kbd>Control + Shift + Home</kbd>: Selects the focused option and all options up to the first option. Optionally, moves focus to the first option.
- <kbd>Control + Shift + End</kbd>: Selects the focused option and all options down to the last option. Optionally, moves focus to the last option.
- <kbd>Control + A</kbd>: Selects all options in the list. Optionally, if all options are selected, it may also unselect all options.

### Additional support

<kbd>Shift + Click</kbd> - Selects a range from the most recently selected option to the currently clicked option. Holding shift causes the range starting point to not reset.

## Examples

### Single Select listbox

<light-preview preview-mode="shadow-dom">
  <template slot="code">
    <role-listbox style="height: 200px;">
      <role-option selected value="1">Option 1</role-option>
      <role-option value="2">Option 2</role-option>
      <role-option value="3">Option 3</role-option>
      <role-option value="4">Option 4</role-option>
      <role-option value="5">Option 5</role-option>
      <role-option value="6">Option 6</role-option>
      <role-option value="7">Option 7</role-option>
      <role-option value="8">Option 8</role-option>
      <role-option value="9">Option 9</role-option>
      <role-option value="10">Option 10</role-option>
      <role-option value="Flamingo">Flamingo</role-option>
    </role-listbox>
  </template>
</light-preview>


### Single Select listbox with wrapping on first / last items

<light-preview preview-mode="shadow-dom">
  <template slot="code">
    <role-listbox wrap-selection style="height: 200px;">
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
      <role-option value="Flamingo">Flamingo</role-option>
    </role-listbox>
  </template>
</light-preview>


### Single Select listbox with groups

<light-preview preview-mode="shadow-dom">
  <template slot="code">
    <role-listbox style="height: 200px;">
      <role-option-group>
        <span slot="label">Land</span>

        <role-option value="dog">Dog</role-option>
        <role-option value="cat">Cat</role-option>
        <role-option value="moose">Moose</role-option>
        <role-option value="goose">Goose</role-option>
        <role-option value="spider_monkey">Spider Monkey</role-option>
      </role-option-group>

      <role-option-group>
        <span slot="label">Water</span>

        <role-option value="rock_lobster">Rock Lobster</role-option>
        <role-option value="snapping_turtle">Snapping Turtle</role-option>
        <role-option value="nessy">Nessy</role-option>
      </role-option-group>

      <role-option-group>
        <span slot="label">Air</span>

        <role-option value="dragon">Dragon</role-option>
        <role-option value="winged_horse">Winged Horse</role-option>
        <role-option value="falcon">Falcon</role-option>
      </role-option-group>
    </role-listbox>
  </template>
</light-preview>

## Multi Select Examples

### Multi-Select listbox

<light-preview preview-mode="shadow-dom">
  <template slot="code">
    <form>
      <role-listbox multiple style="height: 200px;" name="select">
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
  </template>
</light-preview>

### Multi Select listbox with groups

<light-preview preview-mode="shadow-dom">
  <template slot="code">
    <role-listbox multiple style="height: 200px;">
      <role-option-group>
        <span slot="label">Land</span>

        <role-option value="dog">Dog</role-option>
        <role-option value="cat">Cat</role-option>
        <role-option value="moose">Moose</role-option>
        <role-option value="goose">Goose</role-option>
        <role-option value="spider_monkey">Spider Monkey</role-option>
      </role-option-group>

      <role-option-group>
        <span slot="label">Water</span>

        <role-option value="rock_lobster">Rock Lobster</role-option>
        <role-option value="snapping_turtle">Snapping Turtle</role-option>
        <role-option value="nessy">Nessy</role-option>
      </role-option-group>

      <role-option-group>
        <span slot="label">Air</span>

        <role-option value="dragon">Dragon</role-option>
        <role-option value="winged_horse">Winged Horse</role-option>
        <role-option value="falcon">Falcon</role-option>
      </role-option-group>
    </role-listbox>
  </template>
</light-preview>

### Pre-selected options

<light-preview preview-mode="shadow-dom">
  <template slot="code">
    <form>
      <role-listbox name="multiple-select" multiple style="height: 200px;">
        <role-option selected value="dog">Dog</role-option>
        <role-option selected value="cat">Cat</role-option>
        <role-option selected value="moose">Moose</role-option>
        <role-option selected value="goose">Goose</role-option>
        <role-option value="spider_monkey">Spider Monkey</role-option>
        <role-option value="rock_lobster">Rock Lobster</role-option>
        <role-option value="snapping_turtle">Snapping Turtle</role-option>
        <role-option value="nessy">Nessy</role-option>
        <role-option value="dragon">Dragon</role-option>
        <role-option value="winged_horse">Winged Horse</role-option>
        <role-option value="falcon">Falcon</role-option>
      </role-listbox>
    </form>
  </template>
</light-preview>
