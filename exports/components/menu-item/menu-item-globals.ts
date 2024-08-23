import type RoleMenuItem from "./menu-item.js"

declare global {
  interface HTMLElementTagNameMap {
    'role-menu-item': RoleMenuItem
  }
}

export {}
