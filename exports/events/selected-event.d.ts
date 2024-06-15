export class SelectedEvent extends BaseEvent {
    /**
     * @param {import("../../types.js").LooseString<"role-selected" | "role-deselected">} name
     * @param {EventInit & { selectedElement?: null | import("../components/combobox/combobox.js").RoleOption, selectedOption?: import("../components/combobox/combobox.js").OptionObject }} options
     */
    constructor(name: import("../../types.js").LooseString<"role-selected" | "role-deselected">, options: EventInit & {
        selectedElement?: null | import("../components/combobox/combobox.js").RoleOption;
        selectedOption?: import("../components/combobox/combobox.js").OptionObject;
    });
    /**
     * @type {null | import("../components/combobox/combobox.js").RoleOption}
     */
    selectedElement: null | import("../components/combobox/combobox.js").RoleOption;
    /**
     * @type {null | import("../components/combobox/combobox.js").OptionObject}
     */
    selectedOption: null | import("../components/combobox/combobox.js").OptionObject;
}
import { BaseEvent } from "./base-event.js";
