import { BaseEvent } from "./base-event.js";

export class RoleRepositionEvent extends BaseEvent {
  /**
   * @param {EventInit} [init={}]
   */
  constructor (init = {}) {
    super("role-reposition", init)
  }
}

