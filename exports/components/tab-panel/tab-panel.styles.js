import { css } from "lit"

export const componentStyles = css`
  :host {
    display: none;
    padding: 0.6em;
  }

  :host([active]) {
    display: block;
  }
`
