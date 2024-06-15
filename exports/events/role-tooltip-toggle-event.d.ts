/**
 * A "ponyfill" event for grabbing a popover trigger
 */
export class RoleTooltipToggleEvent extends BaseEvent {
    /**
     * @param {EventInit & {triggerElement: Element, triggerEvent: Event}} init
     */
    constructor(init: EventInit & {
        triggerElement: Element;
        triggerEvent: Event;
    });
    /**
     * @type {Element}
     */
    triggerElement: Element;
    /**
     * @type {Event}
     */
    triggerEvent: Event;
}
import { BaseEvent } from "./base-event.js";
