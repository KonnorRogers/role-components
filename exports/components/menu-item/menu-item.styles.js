import { css } from "lit"

export const componentStyles = css`
  :host {
    display: block;
    --background: Canvas;
    padding: 0.4em 0.6em;
    user-select: none;
    -webkit-user-select: none;
  }

  :host(:is(focus-visible, :focus)) {
    outline: 2px solid dodgerblue;
  }
`
