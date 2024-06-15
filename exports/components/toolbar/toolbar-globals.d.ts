import type RoleToolbar from "./toolbar.js"

declare global {
  interface HTMLElementTagNameMap {
    'role-toolbar': RoleToolbar
  }
}

export {}
