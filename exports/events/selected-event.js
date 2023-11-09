import { BaseEvent } from "./base-event.js";

export class SelectedEvent extends BaseEvent {
  /**
   * @param {import("../../types.js").LooseString<"role-selected">} name
   * @param {EventInit & { selectedElement: HTMLElement }} options
   */
  constructor(name, options) {
    if (!name) name = "role-selected";

    super(name, options);

    /**
     * @type {HTMLElement}
     */
    this.selectedElement = options.selectedElement;
  }
}
