import { BaseEvent } from "./base-event.js"

/**
 * A "ponyfill" event for grabbing a popover trigger
 */
export class RoleTooltipToggleEvent extends BaseEvent {
  /**
   * @param {EventInit & {triggerElement: Element, triggerEvent: Event}} init
   */
  constructor (init) {
    super("role-tooltip-toggle", init)

    /**
     * @type {Element}
     */
    this.triggerElement = init.triggerElement

    /**
     * @type {Event}
     */
    this.triggerEvent = init.triggerEvent
  }
}

