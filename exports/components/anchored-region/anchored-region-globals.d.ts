import type RoleAnchoredRegion from "./anchored-region.js"

declare global {
  interface HTMLElementTagNameMap {
    'role-anchored-region': RoleAnchoredRegion
  }
}

export {}
