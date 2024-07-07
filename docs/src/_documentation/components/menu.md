---
---


<role-menu hidden></role-menu>

## Examples

<light-preview
  preview-mode="shadow-dom"
  script-scope="shadow-dom"
>
  <script slot="code" type="text/plain">
    <ul role="menu">
      <li role="none"><a href="#" role="menuitem">Menu Item 1</a></li>
      <li role="none">
        <a href="#" role="menuitem">Menu Item 2</a>
        <ul role="menu">
          <li role="none">
            <a href="#" role="menuitem">Sub Menu Item 1</a>
          </li>
          <li role="none">
            <a href="#" role="menuitem">
              Sub Menu Item 2
            </a>
          </li>
          <li role="none">
            <a href="#" role="menuitem">Sub Menu Item 3</a>
          </li>
        </ul>
      </li>
      <li role="none">
        <a href="#" role="menuitem">Menu Item 3</a>
      </li>
      <li role="none">
        <a href="#" role="menuitem">Menu Item 4</a>
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
    <role-menu role="menu">
      <role-menu-item>Menu Item 1</role-menu-item>
      <role-menu-group style="display: contents;">
        <role-menu-item>
          Menu Item 2
        </role-menu-item>

        <role-menu>
          <role-menu-item>Sub Menu Item 1</role-menu-item>
          <role-menu-item>Sub Menu Item 2</role-menu-item>
          <role-menu-item>Sub Menu Item 3</role-menu-item>
        </role-menu>
      </role-menu-group>
      <role-menu-item>Menu Item 3</role-menu-item>
      <role-menu-item>Menu Item 4</role-menu-item>
    </role-menu>
  </script>
</light-preview>

### First Example
