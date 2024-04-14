import { BaseEvent } from "./base-event.js";

export class SelectedEvent extends BaseEvent {
  /**
   * @param {import("../../types.js").LooseString<"role-selected" | "role-deselected">} name
   * @param {EventInit & { selectedElement: import("../combobox/combobox.js").RoleOption, selectedOption: import("../combobox/combobox.js").OptionObject }} options
   */
  constructor(name, options) {
    super(name, options);

    /**
     * @type {import("../combobox/combobox.js").RoleOption}
     */
    this.selectedElement = options.selectedElement;

    /**
     * @type {import("../combobox/combobox.js").OptionObject}
     */
    this.selectedOption = options.selectedOption;
  }
}
