import { BaseEvent } from "./base-event.js";
/**
 * @type {import("./role-menu-item-selected-event-globals.js")}
 */

/**
  * Event for `role-menu-item-selected` event.
  */
export class RoleMenuItemSelectedEvent extends BaseEvent {
  static eventName = /** @type {const} */ ("role-menu-item-selected")

  /**
   * @param {import("../components/menu-item/menu-item.js").default} menuItem
   * @param {EventInit} [options]
   */
  constructor (menuItem, options) {
    super(RoleMenuItemSelectedEvent.eventName, options)
    this.menuItem = menuItem
  }
}

