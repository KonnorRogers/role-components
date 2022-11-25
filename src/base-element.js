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

    if (this.__sheet__) {
      document.adoptedStyleSheets = [this.__sheet__];
      shadow.adoptedStyleSheets = [this.__sheet__];
    } else {
      content = `
        <style>${this.constructor.styles}</style>
        ${content}
      `;
    }

    this.shadowRoot.innerHTML = content;
  }

  /** @returns {void} */
  connectedCallback() {
    if (!this.isConnected) return;

    // Only actually parse the stylesheet when the first instance is connected.
    // @ts-expect-error
    if (
      this.shadowRoot.adoptedStyleSheets &&
      this.__sheet__.cssRules.length == 0
    ) {
      // @ts-expect-error
      this.__sheet__.replaceSync(this.constructor.styles);
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
   * @returns {null | Element}
   */
  shadowQuery(str) {
    return this.shadowRoot.querySelector(str);
  }

  /**
   * @param {string} str
   * @returns {Element[]}
   */
  shadowQueryAll(str) {
    return this.shadowRoot.querySelectorAll(str);
  }
}
