import { css } from "lit";

export const visuallyHiddenStr = css`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`

export const hostStyles = css`
  :host {
    --role-background-hover-color: #005a9c;
    --role-border-focus-color: #005a9c;
    display: block;
    box-sizing: border-box;
  }

  *,
  *:after,
  *:before {
    box-sizing: border-box;
  }

  [hidden] {
    display: none !important;
  }

  [invisible] {
    visibility: hidden !important;
  }

  .visually-hidden:not(:focus-within):not(:active) {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
`;
