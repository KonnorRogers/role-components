---
---

<role-tab-list hidden></role-tab-list>
<role-tab hidden></role-tab>
<role-tab-panel hidden></role-tab-panel>

## Examples

<light-preview
  preview-mode="shadow-dom"
  script-scope="shadow-dom"
>
  <script type="text/plain" slot="code">
    <style>
      role-tab-panel {
        min-height: 80px;
      }
    </style>
    <role-tab-list>
      <role-tab slot="tab">Tab 1</role-tab>
      <role-tab slot="tab">Tab 2</role-tab>
      <role-tab slot="tab">Tab 3</role-tab>

      <role-tab-panel slot="panel">Content for Tab 1</role-tab-panel>
      <role-tab-panel slot="panel">Content for Tab 2</role-tab-panel>
      <role-tab-panel slot="panel">Content for Tab 3</role-tab-panel>
    </role-tab-list>
  </script>
</light-preview>

### Setting an initial tab

<light-preview
  preview-mode="shadow-dom"
  script-scope="shadow-dom"
>
  <script type="text/plain" slot="code">
    <role-tab-list>
      <role-tab slot="tab">Really really really long tab</role-tab>
      <role-tab active slot="tab">Tab 2</role-tab>
      <role-tab slot="tab">Tab 3</role-tab>

      <role-tab-panel slot="panel">Content for Tab 1</role-tab-panel>
      <role-tab-panel slot="panel">Content for Tab 2</role-tab-panel>
      <role-tab-panel slot="panel">Content for Tab 3</role-tab-panel>
    </role-tab-list>
  </script>
</light-preview>

### Bottom Tab List

<light-preview
  preview-mode="shadow-dom"
  script-scope="shadow-dom"
>
  <script type="text/plain" slot="code">
    <role-tab-list placement="bottom">
      <role-tab slot="tab">Tab 1</role-tab>
      <role-tab slot="tab">Tab 2</role-tab>
      <role-tab slot="tab">Tab 3</role-tab>

      <role-tab-panel slot="panel">Content for Tab 1</role-tab-panel>
      <role-tab-panel slot="panel">Content for Tab 2</role-tab-panel>
      <role-tab-panel slot="panel">Content for Tab 3</role-tab-panel>
    </role-tab-list>
  </script>
</light-preview>

### Vertical Tab List (start)

<light-preview
  preview-mode="shadow-dom"
  script-scope="shadow-dom"
>
  <script type="text/plain" slot="code">
    <role-tab-list placement="start">
      <role-tab slot="tab">Tab 1</role-tab>
      <role-tab slot="tab">Tab 2</role-tab>
      <role-tab slot="tab">Tab 3</role-tab>

      <role-tab-panel slot="panel">Content for Tab 1</role-tab-panel>
      <role-tab-panel slot="panel">Content for Tab 2</role-tab-panel>
      <role-tab-panel slot="panel">Content for Tab 3</role-tab-panel>
    </role-tab-list>
  </script>
</light-preview>

### Vertical Tab List (end)

<light-preview
  preview-mode="shadow-dom"
  script-scope="shadow-dom"
>
  <script type="text/plain" slot="code">
    <role-tab-list placement="end">
      <role-tab slot="tab">Tab 1</role-tab>
      <role-tab slot="tab">Tab 2</role-tab>
      <role-tab slot="tab">Tab 3</role-tab>

      <role-tab-panel slot="panel">Content for Tab 1</role-tab-panel>
      <role-tab-panel slot="panel">Content for Tab 2</role-tab-panel>
      <role-tab-panel slot="panel">Content for Tab 3</role-tab-panel>
    </role-tab-list>
  </script>
</light-preview>

### Overflowing tab list

<light-preview
  preview-mode="shadow-dom"
  script-scope="shadow-dom"
>
  <script type="text/plain" slot="code">
    <role-tab-list>
      <role-tab slot="tab">Really really really long tab</role-tab>
      <role-tab slot="tab">Tab 2</role-tab>
      <role-tab slot="tab">Tab 3</role-tab>
      <role-tab slot="tab">Tab 4</role-tab>
      <role-tab slot="tab">Tab 5</role-tab>
      <role-tab slot="tab">Tab 6</role-tab>
      <role-tab slot="tab">Tab 7</role-tab>
      <role-tab slot="tab">Tab 8</role-tab>
      <role-tab slot="tab">Tab 9</role-tab>
      <role-tab slot="tab">Tab 10</role-tab>

      <role-tab-panel slot="panel">Content for Tab 1</role-tab-panel>
      <role-tab-panel slot="panel">Content for Tab 2</role-tab-panel>
      <role-tab-panel slot="panel">Content for Tab 3</role-tab-panel>
      <role-tab-panel slot="panel">Content for Tab 4</role-tab-panel>
      <role-tab-panel slot="panel">Content for Tab 5</role-tab-panel>
      <role-tab-panel slot="panel">Content for Tab 6</role-tab-panel>
      <role-tab-panel slot="panel">Content for Tab 7</role-tab-panel>
      <role-tab-panel slot="panel">Content for Tab 8</role-tab-panel>
      <role-tab-panel slot="panel">Content for Tab 9</role-tab-panel>
      <role-tab-panel slot="panel">Content for Tab 10</role-tab-panel>
    </role-tab-list>
  </script>
</light-preview>
