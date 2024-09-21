import { css } from "lit"

export const componentStyles = css`
  :host {
    display: block;
    padding: 0.4em 0.6em;
    user-select: none;
    -webkit-user-select: none;
    color: CanvasText;
  }

  :host(:is(focus-visible, :focus)) {
    outline: 2px solid dodgerblue;
    color: white;
    background: dodgerblue;
  }

  [part~="base"] {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, auto);
    gap: 8px;
    align-items: center;
  }
`
