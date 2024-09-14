---
---


<role-menu hidden></role-menu>


## Examples

### First Example

<light-preview
  preview-mode="shadow-dom"
  script-scope="shadow-dom"
>
  <script slot="code" type="text/plain">
    <role-menu>
      <div slot="trigger">
        Menu Options
      </div>
      <role-menu-item>Menu Item 1</role-menu-item>
      <role-menu-item>
        <div>Menu Item 2</div>
        <role-menu slot="submenu">
          <role-menu-item>Sub Menu Item 1</role-menu-item>
          <role-menu-item>Sub Menu Item 2</role-menu-item>
          <role-menu-item>Sub Menu Item 3</role-menu-item>
        </role-menu>
      </role-menu-item>
      <role-menu-item>Menu Item 3</role-menu-item>
      <role-menu-item>Menu Item 4</role-menu-item>
    </role-menu>
  </script>
</light-preview>

<light-preview
  preview-mode="shadow-dom"
  script-scope="shadow-dom"
>
  <script slot="code" type="text/plain">
    <role-menu>
      <div slot="trigger">
        Menu Options
      </div>
      <role-menu-item>Menu Item 1</role-menu-item>
      <role-menu-item>
        <div>Menu Item 2</div>
        <role-menu slot="submenu">
          <role-menu-item>Sub Menu Item 1</role-menu-item>
          <role-menu-item>Sub Menu Item 2</role-menu-item>
          <role-menu-item>Sub Menu Item 3</role-menu-item>
        </role-menu>
      </role-menu-item>
      <role-menu-item>
        <div>Menu Item 3</div>
        <role-menu slot="submenu">
          <role-menu-item>Sub Menu Item 1</role-menu-item>
          <role-menu-item>Sub Menu Item 2</role-menu-item>
          <role-menu-item>Sub Menu Item 3</role-menu-item>
        </role-menu>
      </role-menu-item>
      <role-menu-item>Menu Item 4</role-menu-item>
    </role-menu>
  </script>
</light-preview>
