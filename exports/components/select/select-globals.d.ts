import type RoleSelect from "./select.js"

declare global {
  interface HTMLElementTagNameMap {
    'role-select': RoleSelect
  }
}

export {}
