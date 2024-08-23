import type RoleMenu from "./menu.js"

declare global {
  interface HTMLElementTagNameMap {
    'role-menu': RoleMenu
  }
}

export {}
