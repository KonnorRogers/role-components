import type { RoleRepositionEvent } from "./role-reposition-event.js";

declare global {
  interface GlobalEventHandlersEventMap {
    'role-reposition': RoleRepositionEvent;
  }
}
