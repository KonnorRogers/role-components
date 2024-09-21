import type RoleMenuItem from "./menu-item.js";
import type { RoleMenuItemSelectedEvent } from "../../events/role-menu-item-selected-event.js";
declare global {
    interface HTMLElementTagNameMap {
        'role-menu-item': RoleMenuItem;
    }
    interface GlobalEventHandlersMap {
        'role-menu-item-selected': RoleMenuItemSelectedEvent;
    }
}
export {};
