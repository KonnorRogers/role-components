---
---


<role-menu hidden></role-menu>

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

## Examples

<light-preview
  preview-mode="shadow-dom"
  script-scope="shadow-dom"
>
  <script slot="code" type="text/plain">
    <ul role="menu">
      <li role="none"><div tabindex="0" href="#" role="menuitem">Menu Item 1</div></li>
      <li role="none">
        <div tabindex="0" href="#" role="menuitem">Menu Item 2</div>
        <ul role="menu">
          <li role="none">
            <div tabindex="0" href="#" role="menuitem">Sub Menu Item 1</div>
          </li>
          <li role="none">
            <div tabindex="0" href="#" role="menuitem">
              Sub Menu Item 2
            </div>
          </li>
          <li role="none">
            <div tabindex="0" href="#" role="menuitem">Sub Menu Item 3</div>
          </li>
        </ul>
      </li>
      <li role="none">
        <div tabindex="0" href="#" role="menuitem">Menu Item 3</div>
      </li>
      <li role="none">
        <div tabindex="0" href="#" role="menuitem">Menu Item 4</div>
      </li>
    </ul>
  </script>
</light-preview>

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
