import type { RoleMenuItemSelectedEvent } from "../../events/role-menu-item-selected-event.js";
import type RoleMenu from "./menu.js";
declare global {
    interface HTMLElementTagNameMap {
        'role-menu': RoleMenu;
    }
    interface GlobalEventHandlersMap {
        'role-menu-item-selected': RoleMenuItemSelectedEvent;
    }
}
export {};
