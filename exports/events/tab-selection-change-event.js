import { BaseEvent } from "./base-event.js";

export class TabSelectionChangeEvent extends BaseEvent {
  /**
   * @param {EventInit & {
   activeTab: import("../components/tab/tab.js").default,
   activeTabPanel: import("../components/tab-panel/tab-panel.js").default
   }} init
   */
  constructor (init) {
    super("role-tab-selection-change", init)
    this.activeTab = init.activeTab
    this.activeTabPanel = init.activeTabPanel
  }
}

