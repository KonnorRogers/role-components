import type RoleTooltip from "./tooltip.js"

declare global {
  interface HTMLElementTagNameMap {
    'role-tooltip': RoleTooltip
  }
}

export {}
