import "../exports/tooltip/tooltip-register.js"
import { fixture } from "@open-wc/testing"

test("Should show on hover and hide on mouseout", async () => {
  const container = await fixture(html`
    <div>
      <button data-role-tooltip="tooltip">I'm a button.</button>
      <role-tooltip id="tooltip">My tooltip</role-tooltip>
    </div>
  `)

  const button = container.querySelector("button")
  const tooltip = container.querySelector("role-tooltip")
})

test("Should show on focus and hide on blur", async () => {
  const container = await fixture(html`
    <div>
      <button data-role-tooltip="tooltip">I'm a button.</button>
      <role-tooltip id="tooltip">My tooltip</role-tooltip>
    </div>
  `)
  const button = container.querySelector("button")
  const tooltip = container.querySelector("role-tooltip")
})

test("Should show on focus and hide click", async () => {
  const container = await fixture(html`
    <div>
      <button data-role-tooltip="tooltip">I'm a button.</button>
      <role-tooltip id="tooltip">My tooltip</role-tooltip>
    </div>
  `)
  const button = container.querySelector("button")
  const tooltip = container.querySelector("role-tooltip")
})

test("Should show on hover and hide click", async () => {
  const container = await fixture(html`
    <div>
      <button data-role-tooltip="tooltip">I'm a button.</button>
      <role-tooltip id="tooltip">My tooltip</role-tooltip>
    </div>
  `)
  const button = container.querySelector("button")
  const tooltip = container.querySelector("role-tooltip")
})
