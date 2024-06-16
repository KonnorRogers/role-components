import { css } from "lit"

export const componentStyles = css`
  :host {
    display: block;
  }

  [part~="tab-container"] {
    display: grid;
    grid-auto-flow: column;
    justify-content: start;
    gap: 1em;
  }
`
