import { Controller } from "@hotwired/stimulus";

export default class DirectionSwitcher extends Controller {
  initialize () {
    this.changeDirection = this.changeDirection.bind(this)
    this.element.addEventListener("click", this.changeDirection)
  }

  changeDirection () {
    const lightPreview = this.element.closest("light-preview")
    const preview = lightPreview.shadowRoot.querySelector("[part~='start-panel']")

    const isRTL = preview.matches(":dir(rtl)")
    const willBeRTL = !isRTL

    isRTL ? preview.dir = "ltr" : preview.dir = "rtl"

    this.element.querySelector(".checkmark").innerText = willBeRTL ? "✓" : "✕"

    this.element.setAttribute("aria-pressed", willBeRTL.toString())
  }
}
