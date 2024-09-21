// import { html } from "lit"

// import { BaseElement } from "../../../internal/base-element.js";
// import { hostStyles } from "../../styles/host-styles.js";
// import { componentStyles } from "./slider.styles.js";

// /**
//  * @customElement
//  * @tagname role-slider
//  * @summary Short summary of the component's intended use.
//  * @documentation https://role-components.vercel.app/components/slider
//  * @status experimental
//  * @since 3.0
//  *
//  * @event role-event-name - Emitted as an example.
//  *
//  * @slot - The default slot.
//  *
//  * @csspart base - The component's base wrapper.
//  *
//  * @cssproperty --example - An example CSS custom property.
//  */
// export default class RoleSlider extends BaseElement {
//   static baseName = "role-slider"
//   static styles = [
//     hostStyles,
//     componentStyles,
//   ]

//   static properties = /** @type {const} */ ({
//     role: { reflect: true },
//     orientation: { reflect: true },
//     min: {type: Number},
//     max: {type: Number},
//     step: {
//       converter: {
//         /**
//          * @param {string} value
//          */
//         fromAttribute: (value) => {
//           const val = Number(value)

//           if (val) {
//             return val
//           }

//           return value
//         },
//         /**
//          * @param {string | number} value
//          */
//         toAttribute: (value) => {
//           // `value` is of type `type`
//           // Convert it to a string and return it
//           if (Number.isFinite(value)) {
//             return value.toString()
//           }

//           return value
//         }
//       }
//     },
//     value: {},
//     defaultValue: {},
//     valueText: {attribute: "value-text"},
//     withMarks: {attribute: "with-marks", type: Boolean, reflect: true},
//   })

//   constructor () {
//     super()

//     this.role = "slider"
//     this.internals.role = "slider"
//     this.tabIndex = 0

//     /**
//      * @type {number}
//      */
//     this.min = 0

//     /**
//      * @type {number}
//      */
//     this.max = 100

//     /**
//      * Words to add before the value for screen readers.
//      * @type {string}
//      */
//     this.valuePrefix = ""

//     /**
//      * Words to add after the value for screen readers.
//      * @type {string}
//      */
//     this.valueSuffix = ""

//     /**
//      * If `step="any"`, then the input will not get rounded to the nearest step.
//      * @type {"any" | number}
//      */
//     this.step = 1

//     this.value = 0
//     this.defaultValue = 0

//     this.withMarks = false

//     /**
//      * @type {"vertical" | "horizontal"}
//      */
//     this.orientation = "horizontal"

//     this.addEventListener("pointerdown", this.handlePointerdown, { passive: true })
//     this.addEventListener("pointerup", this.handlePointerup, { passive: true })
//     this.addEventListener("keydown", this.handleKeydown)

//     this.resizeObserver = new ResizeObserver(() => {
//       this.cachedRect = this.getBoundingClientRect()
//     })
//   }

//   connectedCallback () {
//     super.connectedCallback()
//     this.resizeObserver.observe(this)
//   }

//   disconnectedCallback () {
//     super.disconnectedCallback()
//     this.resizeObserver.disconnect()
//   }

//   /**
//    * @param {KeyboardEvent} e
//    */
//   handleKeydown (e) {
//     const { key } = e

//     if (key === "ArrowUp") {
//       e.preventDefault()
//       this.stepUp()
//       return
//     }

//     if (key === "ArrowDown") {
//       e.preventDefault()
//       this.stepDown()
//       return
//     }

//     if (key === "ArrowRight") {
//       e.preventDefault()
//       this.textDirection === "rtl" ? this.stepDown() : this.stepUp()
//       return
//     }

//     if (key === "ArrowLeft") {
//       e.preventDefault()
//       this.textDirection === "rtl" ? this.stepUp() : this.stepDown()
//       return
//     }
//   }

//   /**
//    * @param {import("lit").PropertyValues<this>} changedProperties
//    */
//   firstUpdated (changedProperties) {
//     this.cachedRect = this.getBoundingClientRect()
//     super.firstUpdated(changedProperties)
//   }


//   /**
//    * @param {PointerEvent} e
//    */
//   handlePointermove (e) {
//     this.setValueFromCoordinates(e)
//   }

//   /**
//    * @param {PointerEvent} pointerEvent
//    */
//   setValueFromCoordinates (pointerEvent) {
//     const rect = this.cachedRect

//     let percentage = 0

//     if (this.orientation === "vertical") {
//       percentage = ((pointerEvent.clientY - this.offsetTop) / rect.height)
//       percentage = (1 - percentage)
//     } else {
//       percentage = ((pointerEvent.clientX - this.offsetLeft) / rect.width)
//       if (this.textDirection === "rtl") {
//         percentage = (1 - percentage)
//       }
//     }

//     let value = this.percentageToValue(percentage)
//     value = this.round(value)
//     value = this.clamp(value)
//     this.value = value
//   }

//   /**
//    * @param {Number} percentage
//    */
//   percentageToValue(percentage) {
//     const multiplier = this.max - this.min
//     return ((multiplier * percentage) + this.min)
//   }

//   /**
//    * @param {PointerEvent} e
//    */
//   handlePointerdown (e) {
//     this.addEventListener("pointermove", this.handlePointermove)
//     this.handlePointermove(e) // Make sure we count the click as moving it.
//     this.setPointerCapture(e.pointerId);
//   }

//   /**
//    * @param {PointerEvent} e
//    */
//   handlePointerup (e) {
//     this.removeEventListener("pointermove", this.handlePointermove)
//     if (e.pointerId) {
//       this.releasePointerCapture(e.pointerId)
//     }
//   }

//   stepUp () {
//     let step = /** @type {number} */ (this.step)
//     if (!this.isValidStep(step)) {
//       step = 1
//     }

//     this.value += step
//   }

//   stepDown () {
//     let step = /** @type {number} */ (this.step)
//     if (!this.isValidStep(step)) {
//       step = 1
//     }

//     this.value -= step
//   }

//   /**
//    * @param {Number} value
//    */
//   round (value) {
//     if (this.isValidStep(this.step)) {
//       const increment = /** @type {number} */ (this.step)
//       return Math.round((value) / increment ) * increment;
//     }

//     return value
//   }

//   /**
//    * @param {Number} value
//    */
//   clamp (value) {
//     if (value > this.max) {
//       value = this.max
//     }

//     if (value < this.min) {
//       value = this.min
//     }

//     return value
//   }

//   isValidStep (num = this.step) {
//     const step = Number(num)
//     return step && step > 0
//   }

//   /**
//    * @param {Number} value
//    */
//   valueAsPercent (value) {
//     return ((value - this.min) * 100) / (this.max - this.min)
//   }

//   /**
//    * @param {import("lit").PropertyValues<this>} changedProperties
//    */
//   willUpdate (changedProperties) {
//     if (changedProperties.has("value")) {
//       this.value = this.round(this.value)
//       this.value = this.clamp(this.value)
//     }

//     super.willUpdate(changedProperties)
//   }

//   /**
//    * @param {import("lit").PropertyValues<this>} changedProperties
//    */
//   updated (changedProperties) {
//     if (changedProperties.has("value")) {
//       this.dispatchEvent(new Event("input", { bubbles: true, composed: true }))
//       this.dispatchEvent(new Event("change", { bubbles: true, composed: true }))

//       this.setAria("ariaValueText", `${this.valuePrefix}${this.value}${this.valueSuffix}`)

//       requestAnimationFrame(() => {
//         this.style.setProperty("--active-percent", `${this.valueAsPercent(this.value)}%`)
//       })
//     }

//     if (changedProperties.has("min")) {
//       this.setAria("ariaValueMin", this.min.toString())
//     }

//     if (changedProperties.has("max")) {
//       this.setAria("ariaValueMax", this.max.toString())
//     }

//     super.updated(changedProperties)
//   }

//   renderMarks () {
//     let marks = 0
//     const step = /** @type {number} */ (this.step)
//     if (this.withMarks) {
//       marks = (this.max - this.min) / step
//     }

//     const renderedMarks = []

//     for (let i = this.min; i <= this.max; i++) {
//       const percentage = ((i - this.min) / (this.max - this.min)) * 100;
//       renderedMarks.push(
//         html`<div part='mark' style=${`--percentage: ${percentage}%;`}>${i}</div>`
//       )
//     }

//     return renderedMarks
//   }


//   render () {
//     return html`
//       <div part="track">
//         <div part="active-track"></div>
//         <div part="thumb"></div>
//         <div part="marks" style="position: absolute; width: 100%; height: 100%; top: 0%;><slot name="marks">${this.renderMarks()}</slot></div>
//       </div>
//     `
//   }
// }
