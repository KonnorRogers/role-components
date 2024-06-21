import { css } from "lit"

export const componentStyles = css`
  :host {
    display: inline-block;
    padding: 0.6em 1.2em;
    border: 2px solid transparent;
    outline: transparent;
  }

  :host(:hover) {
    background: lightgray;
    cursor: pointer;
  }

  :host(:focus-visible) {
    border-color: dodgerblue;
  }
`
