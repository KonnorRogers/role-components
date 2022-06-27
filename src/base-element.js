export class BaseElement extends HTMLElement {

  constructor () {
    super()
    this.__sheet__ = undefined;

    try {
      this.__sheet__ = new CSSStyleSheet()
    } catch { /* Sheet not constructable. Probably Safari. Carry on. */ }

    const shadow = this.attachShadow({ mode: 'open'});
    let content = this.render()

    if (this.__sheet__) {
      document.adoptedStyleSheets = [this.__sheet__];
      shadow.adoptedStyleSheets = [this.__sheet__];
    } else {
      content = `
        <style>${this.styles}</style>
        ${content}
      `
    }

    this.shadowRoot.appendChild(templateContent(content));
  }

  /** @returns {void} */
  connectedCallback() {
    if (!this.isConnected) return

    // Only actually parse the stylesheet when the first instance is connected.
    // @ts-expect-error
    if (this.shadowRoot.adoptedStyleSheets && this.__sheet__.cssRules.length == 0) {
      // @ts-expect-error
      this.__sheet__.replaceSync(this.styles);
    }
  }

  /**
   * @returns {string}
   */
  get styles () {
    return ``
  }

  /**
   * @returns {string}
   */
  render () {
    return ``
  }

  /**
   * Allows for firing <attribute>Changed callbacks.
   * @param {string} name - The name of the attribute
   * @param {string} oldValue
   * @param {string} newValue
   * @returns {void}
   */
  attributeChangedCallback(name, oldValue, newValue) {
    const changedCallback = this[`${name}Changed`]
    if (typeof changedCallback === "function") {
      changedCallback(oldValue, newValue)
    }
  }

  /**
   * @param {string} slotName - The name of the slot to grab
   * @param {string} [additionalQueries=""] - Additional queries to add to the selector
   * @returns {null | Element}
   */
  querySlot (slotName, additionalQueries = "") {
    return this.querySelector(`[slot='${slotName}']${additionalQueries || ""}`)
  }

  /**
   * @param {string} slotName - The name of the slot to grab
   * @param {string} [additionalQueries=""] - Additional queries to add to the selector
   * @returns {Element[]}
   */
  querySlotAll (slotName, additionalQueries = "") {
    return this.querySelectorAll(`[slot='${slotName}']${additionalQueries || ""}`)
  }

  /**
   * @param {string} str
   * @returns {null | Element}
   */
  shadowQuery (str) {
    return this.shadowRoot.querySelector(str)
  }


  /**
   * @param {string} str
   * @returns {Element[]}
   */
  shadowQueryAll(str) {
    return this.shadowRoot.querySelectorAll(str)
  }
}

/**
 * @param {string} str
 * @returns {Node}
 */
function templateContent (str) {
  return template(str).content.cloneNode(true)
}

/**
 * @param {string} str
 * @returns {HTMLTemplateElement}
 */
function template (str) {
  const template = document.createElement("template")
  template.innerHTML = str
  return template
}

