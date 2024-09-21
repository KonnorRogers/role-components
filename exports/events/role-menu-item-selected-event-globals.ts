import { RoleMenuItemSelectedEvent } from "./role-menu-item-selected-event.js";

declare global {
  interface GlobalEventHandlersEventMap {
    [RoleMenuItemSelectedEvent.eventName]: RoleMenuItemSelectedEvent
  }
}

