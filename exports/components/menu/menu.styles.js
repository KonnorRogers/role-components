import { css } from "lit"

export const componentStyles = css`
  :host {
    display: block;
    max-width: max-content;
    --background: Canvas;
  }

  [part~="trigger"] {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, auto);
    align-items: center;
    border-radius: 4px;
    border: 1px solid GrayText;
    background: Canvas;
  }

  [part~="trigger"]:hover {
    background: rgba(0,0,0,0.2);
  }

  :host([slot="submenu"]) [part~="trigger"] {
    background: transparent;
    border: none;
    color: inherit;
  }

  :host(:not([slot="submenu"])) [part~="trigger"] {
    padding: 0.4em 0.6em;
  }

  :host(:not([slot="submenu"])) [part~="trigger"]:focus {
    outline: 2px solid dodgerblue;
  }

`
