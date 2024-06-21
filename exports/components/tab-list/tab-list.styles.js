import { css } from "lit"

export const componentStyles = css`
  :host {
    display: block;
    --border-width: 1px;
    --border-color: gray;
  }

  [part~="tab-container"] {
    display: flex;
    overflow: auto;
    position: relative;
  }

  [part~="tab-container"] ::slotted(*) {
    flex: 0 0 auto !important;
  }


  [part~="tab-panel-container"],
  [part~="tab-panel-container"] ::slotted(*) {
    min-height: 100%;
  }

  :host([placement="start"]) {
    display: grid;
    grid-template-columns: minmax(0, auto) minmax(0, 1fr);
    gap: 8px;
  }

  :host([placement="end"]) {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, auto);
    gap: 8px;
  }

  /** (default) placement="top" */
  [part~="tab-container"] {
    border-bottom: 1px solid gray;
  }

  :host([placement="bottom"]) [part~="tab-container"] {
    border: none;
    border-top: 1px solid gray;
  }

  :host([placement="start"]) [part~="tab-container"] {
    border: none;
    border-inline-end: 1px solid gray;
  }

  :host([placement="end"]) [part~="tab-container"] {
    border: none;
    border-inline-start: 1px solid gray;
  }

  :host(:is([placement="start"], [placement="end"])) [part~="tab-container"] {
    flex-direction: column;
  }

  :host(:is([placement="start"], [placement="end"])) [part~="active-tab-indicator"] {
    max-height: 0px;
    height: 100%;
    width: 3px;
    max-width: 0px;
  }

  :host([placement="start"]) [part~="active-tab-indicator"] {
    left: -3px;
  }

  :host([placement="end"]) [part~="active-tab-indicator"] {
    left: 0px;
  }

  :host([placement="bottom"]) [part~="active-tab-indicator"] {
    top: calc(-100%);
  }

  [part~="active-tab-indicator"] {
    position: absolute;
    height: 3px;
    width: 100%;
    max-width: 0px;
    background: red;
    top: -3px;
    left: 0;
    --translate-x: 0px;
    --translate-y: 0px;
    transform: translateX(var(--translate-x)) translateY(var(--translate-y));
  }

  .animate[part~="active-tab-indicator"] {
    transition:
      transform 0.2s ease-in-out,
      max-width 0.2s ease-in-out
  }
`
