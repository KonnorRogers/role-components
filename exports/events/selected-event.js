import { BaseEvent } from "./base-event.js";

export class SelectedEvent extends BaseEvent {
  /**
   * @param {import("../../types.js").LooseString<"role-selected" | "role-deselected">} name
   * @param {EventInit & { selectedElement: HTMLElement, selectedOption: import("../combobox/combobox.js").OptionObject }} options
   */
  constructor(name, options) {
    super(name, options);

    /**
     * @type {HTMLElement}
     */
    this.selectedElement = options.selectedElement;
  }
}
