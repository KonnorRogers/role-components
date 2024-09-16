import { css } from "lit"

export const styles = css`
[name="trigger"]::slotted(input) {
  font-size: 1.1em;
  padding-inline-start: 0.4em;
  padding-inline-end: 0.4em;
  line-height: 1.8;
  -webkit-appearance: none;
  appearance: none;
  background: Field;
  color: FieldText;
  border: 1px solid GrayText;
}

[name="trigger"]::slotted(*:focus-within) {
  outline: 2px solid dodgerblue;
}

[part~="anchor"] {
  display: grid;
  grid-template-columns: minmax(0, auto) minmax(0, 1fr) minmax(0, auto);
  grid-template-rows: minmax(0, 1fr);
}

/** because position: absolute; + isolation: isolate; don't always pierce. */
[part~='popup'] {
  --background: transparent;
}

[part~="base"] {
  display: grid;
  grid-template-rows: minmax(0, auto) minmax(0, 1fr);
  gap: 8px;
}

[part~="remove-button"] {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  appearance: none;
  background: rgba(235,235,235,1);
  color: ButtonText;
  border: 1px solid ButtonText;
  font-size: 0.9em;
  padding: 0.2em 0.4em;
}

[part~="listbox"] {
  border: 1px solid darkgray;
  max-height: var(--auto-size-available-height, 100%);
  overflow: auto;
  background: Canvas;
}

[part~="selected-options"] {
  list-style-type: '';
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
}
`
