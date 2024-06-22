import { css } from "lit"

export const componentStyles = css`
  :host {
    display: block;
    --indicator-size: 3px;
    --indicator-color: dodgerblue;
    --border-width: 1px;
  }

  [part~="tab-container"] {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    overflow: auto;
    position: relative;
    z-index: 0;
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
    border-bottom: var(--border-width) solid gray;
  }

  :host([placement="bottom"]) [part~="tab-container"] {
    border: none;
    border-top: var(--border-width) solid gray;
  }

  :host([placement="start"]) [part~="tab-container"] {
    border: none;
    border-inline-end: var(--border-width) solid gray;
  }

  :host([placement="end"]) [part~="tab-container"] {
    border: none;
    border-inline-start: var(--border-width) solid gray;
  }

  :host(:is([placement="start"], [placement="end"])) [part~="tab-container"] {
    grid-auto-flow: row;
  }

  :host(:is([placement="start"], [placement="end"])) [part~="active-tab-indicator"] {
    max-height: var(--active-tab-height);
    height: 100%;
    width: var(--indicator-size);
    max-width: auto;
  }

  :host([placement="start"]) [part~="active-tab-indicator"] {
    top: 0;
    left: calc(var(--indicator-size) * -1);
  }

  :host([placement="end"]) [part~="active-tab-indicator"] {
    top: 0;
    left: 0px;
  }

  :host([placement="bottom"]) [part~="active-tab-indicator"] {
    top: calc(-100%);
  }

  [part~="active-tab-indicator"] {
    position: absolute;
    height: var(--indicator-size);
    width: 100%;
    max-width: var(--active-tab-width);
    background: var(--indicator-color);
    top: calc(var(--indicator-size) * -1);
    left: 0;
    --translate-x: 0px;
    --translate-y: 0px;
    transform: translateX(var(--translate-x)) translateY(var(--translate-y));
  }

  :host([data-run-animations]) [part~="active-tab-indicator"] {
    transition:
      transform 0.2s ease-in-out,
      max-width 0.2s ease-in-out
  }
`
