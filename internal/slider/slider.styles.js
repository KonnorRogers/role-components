import { css } from "lit"

export const componentStyles = css`
  :host {
    display: block;
    outline: transparent;
    --track-color: rgba(0,0,0,0.2);
    --active-color: dodgerblue;
    --active-percent: 50%;
    height: 1.25em;
  }

  :host([orientation="vertical"]) {
    height: 200px;
    width: 1.25em;
  }

  [part~="track"] {
    height: 100%;
    width: 100%;
    border: 2px solid green;
    background: var(--track-color);
    border-radius: 16px;
    position: relative;
  }

  [part~="active-track"] {
    background: var(--active-color);
    height: 100%;
    left: 0;
    max-width: var(--active-percent);
    border-radius: inherit;
    position: absolute;
    width: 100%;
    bottom: 0;
  }

  [part~="active-track"]:dir(rtl) {
    right: 0;
    left: unset;
    max-width: var(--active-percent);
  }

  [part~="mark"] {
    left: var(--percentage);
    position: absolute;
    transform: translateX(-50%);
  }

  [part~="mark"]:dir(rtl) {
    left: calc(100% - var(--percentage));
  }

  :host([orientation="vertical"]) [part~="mark"] {
    left: 100%;
    top: calc(100% - var(--percentage));
  }

  :host([orientation="vertical"]) [part~="active-track"] {
    max-height: var(--active-percent);
    max-width: 100%;
    width: 100%;
    left: 0;
  }

  :host(:focus-visible) [part~="thumb"] {
    outline: 2px solid red;
  }

  :host(:active) [part~="thumb"] {
    background: lightgray;
  }

  :host([orientation="vertical"]) [part~="thumb"] {
    width: 150%;
    height: 1.5em;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    top: calc(100% - var(--active-percent));
  }

  [part~="thumb"] {
    height: 150%;
    width: 1.5em;
    border: 1px solid green;
    background: white;
    position: absolute;
    top: 50%;
    left: var(--active-percent);
    transform: translateX(-50%) translateY(-50%);
    border-radius: 9999px;
  }

  [part~="thumb"]:dir(rtl) {
    left: calc(100% - var(--active-percent));
  }
`
