export class LanguageObserver {
  /**
   * @type {MutationObserverInit}
   */
  static options = {
    subtree: true,
    attributes: true,
    childList: true,
    attributeFilter: ["lang", "dir"],
    attributeOldValue: true
  }
  /**
   * @type {null | ReturnType<typeof setTimeout>}
   */
  static langTimeout = null
  /**
   * @type {null | ReturnType<typeof setTimeout>}
   */
  static dirTimeout = null

  static eventTarget = new EventTarget()
  static observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      if (mutation.type === "attributes") {
          if (mutation.attributeName === "lang") {
            if (this.langTimeout) {
              clearTimeout(this.langTimeout)
            }

            this.langTimeout = setTimeout(() => {
              this.eventTarget.dispatchEvent(new Event("lang-change"))
            }, 20)
          }

          if (mutation.attributeName === "dir") {
            if (this.dirTimeout) {
              clearTimeout(this.dirTimeout)
            }
            this.dirTimeout = setTimeout(() => {
              this.eventTarget.dispatchEvent(new Event("dir-change"))
            }, 20)
          }
      }
    }
  })

  /**
   * @param {HTMLElement} element
   */
  constructor (element) {
    this.element = element

    this.handleLangChange = () => {}
    this.handleDirChange = () => {}

    this.__handleLangChange = () => this.handleLangChange()
    this.__handleDirChange = () => this.handleDirChange()
    ;/** @type {typeof LanguageObserver} */ (this.constructor).eventTarget.addEventListener("lang-change", this.__handleLangChange)

    ;/** @type {typeof LanguageObserver} */ (this.constructor).eventTarget.addEventListener("dir-change", this.__handleDirChange)
  }

  start () {
    const ctor = /** @type {typeof LanguageObserver} */ (this.constructor)
    ctor.observer.observe(document.documentElement, ctor.options)

    // @ts-expect-error
    const host = this.element.getRootNode().host

    if (host) {
      ctor.observer.observe(host, ctor.options)
    }

    return this
  }

  stop () {
    ;/** @type {typeof LanguageObserver} */ (this.constructor).observer.disconnect()
    return this
  }
}
