import type { RoleTooltipToggleEvent } from "./role-tooltip-toggle-event.js";

declare global {
  interface GlobalEventHandlersEventMap {
    'role-tooltip-toggle': RoleTooltipToggleEvent;
  }
}
