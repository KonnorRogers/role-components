// @ts-check

/** @extends {HTMLElement} */
export class BaseElement extends HTMLElement {
  constructor() {
    super();

    this.__sheet__ = undefined;

    try {
      this.__sheet__ = new CSSStyleSheet();
    } catch {
      /* Sheet not constructable. Probably Safari. Carry on. */
    }

    const shadow = this.attachShadow({ mode: "open" });
    let content = this.render();

    /** @type {any} */
    const ctor = this.constructor

    if (this.__sheet__) {
      document.adoptedStyleSheets = [this.__sheet__];
      shadow.adoptedStyleSheets = [this.__sheet__];
    } else {
      content = `
        <style>${ctor.styles}</style>
        ${content}
      `;
    }

    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = content;
    }
  }

  /** @type {CustomElementRegistry} */
  static customElementRegistry = window.customElements

  /** @type {string} */
  static baseName

  /**
   * @param {string} [name]
   * @param {CustomElementConstructor} [ctor]
   * @param {ElementDefinitionOptions} [options]
   */
  static define (
    name,
    ctor,
    options
  ) {
    if (name == null) name = this.baseName
    if (ctor == null) ctor = this

    // Can't register twice.
    if (this.customElementRegistry.get(name)) return

  // creates anonymous class due to a limitation of CEs only allowing 1 class definition.
    this.customElementRegistry.define(name, toAnonymousClass(ctor), options)
  }

  /** @returns {void} */
  connectedCallback() {
    if (!this.isConnected) return;

    /**
     * @type {any}
     */
    const ctor = this.constructor

    // Only actually parse the stylesheet when the first instance is connected.
    if (
      this.shadowRoot && this.shadowRoot.adoptedStyleSheets &&
      this.__sheet__ && this.__sheet__.cssRules.length == 0
    ) {
      this.__sheet__.replaceSync(ctor.styles);
    }
  }

  /**
   * @returns {string}
   */
  static get styles() {
    return ``;
  }

  /**
   * @returns {string}
   */
  render() {
    return ``;
  }

  /**
   * @param {string} str
   * @returns {undefined | null | Element}
   */
  shadowQuery(str) {
    return this.shadowRoot?.querySelector(str);
  }

  /**
   * @param {string} str
   * @returns {Element[]}
   */
  shadowQueryAll(str) {
    if (this.shadowRoot == null) return []

    return [...this.shadowRoot.querySelectorAll(str)];
  }
}

/**
 * @type {import("./base-element").toAnonymousClass}
 */
function toAnonymousClass (klass) {
  return class extends klass {}
}

