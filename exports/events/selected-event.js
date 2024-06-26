import { BaseEvent } from "./base-event.js";

export class SelectedEvent extends BaseEvent {
  /**
   * @param {import("../../types.js").LooseString<"role-selected" | "role-deselected">} name
   * @param {EventInit & { selectedElement?: null | import("../components/combobox/combobox.js").RoleOption, selectedOption?: import("../components/combobox/combobox.js").OptionObject }} options
   */
  constructor(name, options) {
    super(name, options);

    /**
     * @type {null | import("../components/combobox/combobox.js").RoleOption}
     */
    this.selectedElement = options.selectedElement || null;

    /**
     * @type {null | import("../components/combobox/combobox.js").OptionObject}
     */
    this.selectedOption = options.selectedOption || null;
  }
}
