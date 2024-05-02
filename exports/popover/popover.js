import { arrow, autoUpdate, computePosition, flip, offset, platform, shift, size } from '@floating-ui/dom';
import { classMap } from 'lit/directives/class-map.js';
import { html, css } from 'lit';
import { offsetParent } from 'composed-offset-position';
import { BaseElement } from "../base-element.js";
import { hostStyles } from "../styles/host-styles.js";

/**
 * @typedef {object} VirtualElement
 * @property {() => DOMRect} getBoundingClientRect
 * @property {Element} [contextElement]
 */

/**
 * @param {unknown} e
 * @satisfies {VirtualElement}
 */
function isVirtualElement(e) {
  return (
    e !== null &&
    typeof e === 'object' &&
    'getBoundingClientRect' in e &&
    ('contextElement' in e ? e instanceof Element : true)
  );
}


/**
 * @template {Omit<typeof BaseElement, "new"> & {new (...args: any[]): any }} T
 * @param {T} superclass
 */
export function PopoverMixin (superclass) {
  return class extends superclass {
    /**
     * @param {any[]} args
     */
    constructor (...args) {
      super(...args)

      /**
       * The preferred placement of the popover. Note that the actual placement will vary as configured to keep the
       * panel inside of the viewport.
       * @type {
          'top'
          | 'top-start'
          | 'top-end'
          | 'bottom'
          | 'bottom-start'
          | 'bottom-end'
          | 'right'
          | 'right-start'
          | 'right-end'
          | 'left'
          | 'left-start'
          | 'left-end'
       }
       */
      this.placement = "top"

      /**
       * Determines how the popover is positioned. The `absolute` strategy works well in most cases, but if overflow is
       * clipped, using a `fixed` position strategy can often workaround it.
       * @type {import("@floating-ui/dom").Strategy}
       */
      this.strategy = "absolute"

      /** The distance in pixels from which to offset the panel away from its anchor. */
      this.distance = 0;

      /** The distance in pixels from which to offset the panel along its anchor. */
      this.skidding = 0;

      /**
      * Attaches an arrow to the popover. The arrow's size and color can be customized using the `--arrow-size` and
      * `--background-color` custom properties. For additional customizations, you can also target the arrow using
      * `::part(arrow)` in your stylesheet.
      */
      this.arrow = false;

      /**
      * The placement of the arrow. The default is `anchor`, which will align the arrow as close to the center of the
      * anchor as possible, considering available space and `arrow-padding`. A value of `start`, `end`, or `center` will
      * align the arrow to the start, end, or center of the popover instead.
      * @type {'start' | 'end' | 'center' | 'anchor'}
      */
      this.arrowPlacement = 'anchor';

      /**
       * The amount of padding between the arrow and the edges of the popover. If the popover has a border-radius, for example,
       * this will prevent it from overflowing the corners.
       */
      this.arrowPadding = 10

      /**
      * When set, placement of the popover will flip to the opposite site to keep it in view. You can use
      * `flipFallbackPlacements` to further configure how the fallback placement is determined.
      */
      this.flip = false;

      /**
      * If the preferred placement doesn't fit, popover will be tested in these fallback placements until one fits. Must be a
      * string of any number of placements separated by a space, e.g. "top bottom left". If no placement fits, the flip
      * fallback strategy will be used instead.
      */
      this.flipFallbackPlacements = '';

      /**
      * When neither the preferred placement nor the fallback placements fit, this value will be used to determine whether
      * the popover should be positioned using the best available fit based on available space or as it was initially
      * preferred.
      * @type {'best-fit' | 'initial'}
      */
      this.flipFallbackStrategy = 'best-fit';

      /**
      * The flip boundary describes clipping element(s) that overflow will be checked relative to when flipping. By
      * default, the boundary includes overflow ancestors that will cause the element to be clipped. If needed, you can
      * change the boundary by passing a reference to one or more elements to this property.
      * @type {Element | Element[]}
      */
      this.flipBoundary

      /** The amount of padding, in pixels, to exceed before the flip behavior will occur. */
      this.flipPadding = 0;

      /** Moves the popover along the axis to keep it in view when clipped. */
      this.shift = false;


      /**
      * The shift boundary describes clipping element(s) that overflow will be checked relative to when shifting. By
      * default, the boundary includes overflow ancestors that will cause the element to be clipped. If needed, you can
      * change the boundary by passing a reference to one or more elements to this property.
      * @type {Element | Element[]}
      */
      this.shiftBoundary

      /** The amount of padding, in pixels, to exceed before the shift behavior will occur. */
      this.shiftPadding = 0;

      /**
        * When set, this will cause the popover to automatically resize itself to prevent it from overflowing.
        * @type {'horizontal' | 'vertical' | 'both'}
        */
      this.autoSize

      /**
       * Syncs the popover's width or height to that of the anchor element.
       * @type {'width' | 'height' | 'both'}
       */
      this.sync

      /**
       * The auto-size boundary describes clipping element(s) that overflow will be checked relative to when resizing. By
       * default, the boundary includes overflow ancestors that will cause the element to be clipped. If needed, you can
       * change the boundary by passing a reference to one or more elements to this property.
       * @type {Element | Element[]}
       */
      this.autoSizeBoundary


      /** The amount of padding, in pixels, to exceed before the auto-size behavior will occur. */
      this.autoSizePadding = 0;

      /**
       * When a gap exists between the anchor and the popover element, this option will add a "hover bridge" that fills the
       * gap using an invisible element. This makes listening for events such as `mouseenter` and `mouseleave` more sane
       * because the pointer never technically leaves the element. The hover bridge will only be drawn when the popover is
       * active.
       */
      this.hoverBridge = false
    }
  }
}

export const PopoverProperties = () => ({
  placement: { reflect: true },
  strategy: { reflect: true },
  distance: { type: Number },
  skidding: { type: Number },
  arrow: { type: Boolean },
  arrowPlacement: { attribute: 'arrow-placement' },
  arrowPadding: { attribute: 'arrow-padding', type: Number },
  flip: { type: Boolean },
  flipFallbackPlacements: {
    attribute: 'flip-fallback-placements',
    converter: {
      /**
        * @param {string} value
        */
      fromAttribute: (value) => {
        return value
          .split(' ')
          .map(p => p.trim())
          .filter(p => p !== '');
      },
      /**
        * @param {[]} value
        */
      toAttribute: (value) => {
        return value.join(' ');
      }
    }
  },
  flipFallbackStrategy: { attribute: 'flip-fallback-strategy' },
  flipBoundary: { type: Object },
  flipPadding: { attribute: 'flip-padding', type: Number },
  shift: { type: Boolean },
  shiftBoundary: { type: Object },
  shiftPadding: { attribute: 'shift-padding', type: Number },
  autoSize: { attribute: 'auto-size' },
  sync: {},
  autoSizeBoundary: { type: Object },
  autoSizePadding: { attribute: 'auto-size-padding', type: Number },
  hoverBridge: { attribute: 'hover-bridge', type: Boolean },
})


/**
 * @summary Popup is a utility that lets you declaratively anchor "popover" containers to another element.
 * @documentation https://shoelace.style/components/popover
 * @status stable
 * @since 2.0
 *
 * @event role-reposition - Emitted when the popover is repositioned. This event can fire a lot, so avoid putting expensive
 *  operations in your listener or consider debouncing it.
 *
 * @slot - The popover's content.
 * @slot anchor - The element the popover will be anchored to. If the anchor lives outside of the popover, you can use the
 *  `anchor` attribute or property instead.
 *
 * @csspart arrow - The arrow's container. Avoid setting `top|bottom|left|right` properties, as these values are
 *  assigned dynamically as the popover moves. This is most useful for applying a background color to match the popover, and
 *  maybe a border or box shadow.
 * @csspart popover - The popover's container. Useful for setting a background color, box shadow, etc.
 * @csspart hover-bridge - The hover bridge element. Only available when the `hover-bridge` option is enabled.
 *
 * @cssproperty [--arrow-size=6px] - The size of the arrow. Note that an arrow won't be shown unless the `arrow`
 *  attribute is used.
 * @cssproperty [--auto-size-available-width] - A read-only custom property that determines the amount of width the
 *  popover can be before overflowing. Useful for positioning child elements that need to overflow. This property is only
 *  available when using `auto-size`.
 * @cssproperty [--auto-size-available-height] - A read-only custom property that determines the amount of height the
 *  popover can be before overflowing. Useful for positioning child elements that need to overflow. This property is only
 *  available when using `auto-size`.
 */
export default class RolePopover extends PopoverMixin(BaseElement) {
  static styles =  [
    hostStyles,
    css`
      :host {
        --__background: var(--background, #222);
        --__border-color: var(--border-color, transparent);
        --__border-width: var(--border-width, 1px);
        --__arrow-size: var(--arrow-size, 8px);

        /*
        * These properties are computed to account for the arrow's dimensions after being rotated 45º. The constant
        * 0.7071 is derived from sin(45), which is the diagonal size of the arrow's container after rotating.
        */
        --arrow-size-diagonal: calc(var(--__arrow-size) * 0.7071);
        --arrow-padding-offset: calc(var(--arrow-size-diagonal) - var(--__arrow-size));

        display: contents;
      }

      .popover {
        position: absolute;
        isolation: isolate;
        max-width: var(--auto-size-available-width, none);
        max-height: var(--auto-size-available-height, none);
        border: var(--__border-width) solid var(--__border-color);
        background: var(--__background);
      }

      .popover--fixed {
        position: fixed;
      }

      .popover:not(.popover--active) {
        display: none;
      }

      .popover__arrow {
        position: absolute;
        width: calc(var(--arrow-size-diagonal) * 2);
        height: calc(var(--arrow-size-diagonal) * 2);
        background: var(--__background);
        border: var(--__border-width) solid var(--__border-color);
        rotate: 45deg;
        z-index: -1;
      }

      /* Hover bridge */
      .popover-hover-bridge:not(.popover-hover-bridge--visible) {
        display: none;
      }

      .popover-hover-bridge {
        position: fixed;
        z-index: calc(var(--z-index-dropdown, 900) - 1);
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        clip-path: polygon(
          var(--hover-bridge-top-left-x, 0) var(--hover-bridge-top-left-y, 0),
          var(--hover-bridge-top-right-x, 0) var(--hover-bridge-top-right-y, 0),
          var(--hover-bridge-bottom-right-x, 0) var(--hover-bridge-bottom-right-y, 0),
          var(--hover-bridge-bottom-left-x, 0) var(--hover-bridge-bottom-left-y, 0)
        );
      }

      :host([data-current-placement="top"]) .arrow {
        border-top: 0px;
        border-left: 0px;
      }

      :host([data-current-placement="bottom"]) .arrow {
        border-bottom: 0px;
        border-right: 0px;
      }

      :host([data-current-placement="left"]) .arrow {
        border-bottom: 0px;
        border-left: 0px;
      }

      :host([data-current-placement="right"]) .arrow {
        border-top: 0px;
        border-right: 0px;
      }
    `
  ];

  static properties = {
    ...(PopoverProperties()),
    anchor: { attribute: false, state: true },
    active: { type: Boolean, reflect: true }
  }

  constructor () {
    super()

    // Needed by floating-ui
    // @ts-expect-error
    if (window.process == null) window.process = {};
    // @ts-expect-error
    if (window.process.env == null) window.process.env = "development";


    this.active = false

    /**
    * The element the popover will be anchored to. If the anchor lives outside of the popover, you can provide the anchor
    * element `id`, a DOM element reference, or a `VirtualElement`. If the anchor lives inside the popover, use the
    * `anchor` slot instead.
    * @type {null | Element | string | VirtualElement}
    */
    this.anchor = null

    /**
    * Activates the positioning logic and shows the popover. When this attribute is removed, the positioning logic is torn
    * down and the popover will be hidden.
    */
    this.active = false;

    /**
    * @internal
    * @type {Element | VirtualElement | null}
    */
    this.__anchorEl = null

    /**
    * @internal
    * @type {ReturnType<typeof autoUpdate> | undefined}
    */
    this.__cleanup
  }

  async connectedCallback() {
    super.connectedCallback();

    // Start the positioner after the first update
    await this.updateComplete;
    this.__start();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.__stop();
  }

  /**
   * @param {import('lit').PropertyValues<this>} changedProps
   */
  async updated(changedProps) {
    super.updated(changedProps);

    // Start or stop the positioner when active changes
    if (changedProps.has('active')) {
      if (this.active) {
        this.__start();
      } else {
        this.__stop();
      }
    }

    // Update the anchor when anchor changes
    if (changedProps.has('anchor')) {
      this.__handleAnchorChange();
    }

    // All other properties will trigger a reposition when active
    if (this.active) {
      await this.updateComplete;
      this.reposition();
    }
  }

  /**
   * A reference to the internal popover container. Useful for animating and styling the popover with JavaScript.
   *
   */
  get popoverElement () {
    return this.shadowRoot?.querySelector(".popover") || null
  }

  get arrowElement () {
    return this.shadowRoot?.querySelector('.popover__arrow') || null
  }

  /**
   * @internal
   */
  async __handleAnchorChange() {
    await this.__stop();

    if (this.anchor && typeof this.anchor === 'string') {
      // Locate the anchor by id
      const root = /** @type {Document | ShadowRoot} */ (this.getRootNode())
      this.anchorEl = root.getElementById(this.anchor);
    } else if (this.anchor instanceof Element || isVirtualElement(this.anchor)) {
      // Use the anchor's reference
      this.anchorEl = this.anchor;
    } else {
      // Look for a slotted anchor
      this.anchorEl = /** @type {HTMLElement} */ (this.querySelector('[slot="anchor"]'));
    }

    // If the anchor is a <slot>, we'll use the first assigned element as the target since slots use `display: contents`
    // and positioning can't be calculated on them
    if (this.anchorEl instanceof HTMLSlotElement) {
      this.anchorEl = /** @type {HTMLElement} */ (this.anchorEl.assignedElements({ flatten: true })[0])
    }

    // If the anchor is valid, start it up
    if (this.anchorEl) {
      this.__start();
    }
  }

  /**
   * @internal
   */
  __start() {
    // We can't start the positioner without an anchor
    if (!this.anchorEl) {
      return;
    }

    this.cleanup = autoUpdate(this.anchorEl, this.popover, () => {
      this.reposition();
    });
  }

  /**
   * @internal
   * @returns {Promise<void>}
   */
  async __stop() {
    return new Promise(resolve => {
      if (this.cleanup) {
        this.cleanup();
        this.cleanup = undefined;
        this.removeAttribute('data-current-placement');
        this.style.removeProperty('--auto-size-available-width');
        this.style.removeProperty('--auto-size-available-height');
        requestAnimationFrame(() => resolve());
      } else {
        resolve();
      }
    });
  }

  /** Forces the popover to recalculate and reposition itself. */
  reposition() {
    // Nothing to do if the popover is inactive or the anchor doesn't exist
    if (!this.active || !this.anchorEl) {
      return;
    }

    //
    // NOTE: Floating UI middlewares are order dependent: https://floating-ui.com/docs/middleware
    //
    const middleware = [
      // The offset middleware goes first
      offset({ mainAxis: this.distance, crossAxis: this.skidding })
    ];

    // First we sync width/height
    if (this.sync) {
      middleware.push(
        size({
          apply: ({ rects }) => {
            const syncWidth = this.sync === 'width' || this.sync === 'both';
            const syncHeight = this.sync === 'height' || this.sync === 'both';
            this.popover.style.width = syncWidth ? `${rects.reference.width}px` : '';
            this.popover.style.height = syncHeight ? `${rects.reference.height}px` : '';
          }
        })
      );
    } else {
      // Cleanup styles if we're not matching width/height
      this.popover.style.width = '';
      this.popover.style.height = '';
    }

    // Then we flip
    if (this.flip) {
      middleware.push(
        flip({
          boundary: this.flipBoundary,
          // @ts-expect-error - We're converting a string attribute to an array here
          fallbackPlacements: this.flipFallbackPlacements,
          fallbackStrategy: this.flipFallbackStrategy === 'best-fit' ? 'bestFit' : 'initialPlacement',
          padding: this.flipPadding
        })
      );
    }

    // Then we shift
    if (this.shift) {
      middleware.push(
        shift({
          boundary: this.shiftBoundary,
          padding: this.shiftPadding
        })
      );
    }

    // Now we adjust the size as needed
    if (this.autoSize) {
      middleware.push(
        size({
          boundary: this.autoSizeBoundary,
          padding: this.autoSizePadding,
          apply: ({ availableWidth, availableHeight }) => {
            if (this.autoSize === 'vertical' || this.autoSize === 'both') {
              this.style.setProperty('--auto-size-available-height', `${availableHeight}px`);
            } else {
              this.style.removeProperty('--auto-size-available-height');
            }

            if (this.autoSize === 'horizontal' || this.autoSize === 'both') {
              this.style.setProperty('--auto-size-available-width', `${availableWidth}px`);
            } else {
              this.style.removeProperty('--auto-size-available-width');
            }
          }
        })
      );
    } else {
      // Cleanup styles if we're no longer using auto-size
      this.style.removeProperty('--auto-size-available-width');
      this.style.removeProperty('--auto-size-available-height');
    }

    // Finally, we add an arrow
    if (this.arrow) {
      middleware.push(
        arrow({
          element: this.arrowEl,
          padding: this.arrowPadding
        })
      );
    }

    //
    // Use custom positioning logic if the strategy is absolute. Otherwise, fall back to the default logic.
    //
    // More info: https://github.com/shoelace-style/shoelace/issues/1135
    //
    const getOffsetParent =
      this.strategy === 'absolute'

        ? (/** @type {Element} */ element) => platform.getOffsetParent(element, offsetParent)
        : platform.getOffsetParent;

    computePosition(this.anchorEl, this.popover, {
      placement: this.placement,
      middleware,
      strategy: this.strategy,
      platform: {
        ...platform,
        getOffsetParent
      }
    }).then(({ x, y, middlewareData, placement }) => {
      //
      // Even though we have our own localization utility, it uses different heuristics to determine RTL. Because of
      // that, we'll use the same approach that Floating UI uses.
      //
      // Source: https://github.com/floating-ui/floating-ui/blob/cb3b6ab07f95275730d3e6e46c702f8d4908b55c/packages/dom/src/utils/getDocumentRect.ts#L31
      //
      const isRtl = getComputedStyle(this).direction === 'rtl';

      const staticSide = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }[placement.split('-')[0]] || this.placement;

      this.setAttribute('data-current-placement', placement);

      Object.assign(this.popover.style, {
        left: `${x}px`,
        top: `${y}px`
      });

      if (this.arrow && middlewareData.arrow) {
        const arrowX = middlewareData.arrow.x;
        const arrowY = middlewareData.arrow.y;
        let top = '';
        let right = '';
        let bottom = '';
        let left = '';

        if (this.arrowPlacement === 'start') {
          // Start
          const value = typeof arrowX === 'number' ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : '';
          top = typeof arrowY === 'number' ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : '';
          right = isRtl ? value : '';
          left = isRtl ? '' : value;
        } else if (this.arrowPlacement === 'end') {
          // End
          const value = typeof arrowX === 'number' ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : '';
          right = isRtl ? '' : value;
          left = isRtl ? value : '';
          bottom = typeof arrowY === 'number' ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : '';
        } else if (this.arrowPlacement === 'center') {
          // Center
          left = typeof arrowX === 'number' ? `calc(50% - var(--arrow-size-diagonal))` : '';
          top = typeof arrowY === 'number' ? `calc(50% - var(--arrow-size-diagonal))` : '';
        } else {
          // Anchor (default)
          left = typeof arrowX === 'number' ? `${arrowX}px` : '';
          top = typeof arrowY === 'number' ? `${arrowY}px` : '';
        }

        Object.assign(this.arrowEl.style, {
          top,
          right,
          bottom,
          left,
          [staticSide]: 'calc(var(--arrow-size-diagonal) * -1)'
        });
      }
    });

    // Wait until the new position is drawn before updating the hover bridge, otherwise it can get out of sync
    requestAnimationFrame(() => this.updateHoverBridge());

    this.emit('sl-reposition');
  }

  updateHoverBridge = () => {
    if (this.hoverBridge && this.anchorEl) {
      const anchorRect = this.anchorEl.getBoundingClientRect();
      const popoverRect = this.popover.getBoundingClientRect();
      const isVertical = this.placement.includes('top') || this.placement.includes('bottom');
      let topLeftX = 0;
      let topLeftY = 0;
      let topRightX = 0;
      let topRightY = 0;
      let bottomLeftX = 0;
      let bottomLeftY = 0;
      let bottomRightX = 0;
      let bottomRightY = 0;

      if (isVertical) {
        if (anchorRect.top < popoverRect.top) {
          // Anchor is above
          topLeftX = anchorRect.left;
          topLeftY = anchorRect.bottom;
          topRightX = anchorRect.right;
          topRightY = anchorRect.bottom;

          bottomLeftX = popoverRect.left;
          bottomLeftY = popoverRect.top;
          bottomRightX = popoverRect.right;
          bottomRightY = popoverRect.top;
        } else {
          // Anchor is below
          topLeftX = popoverRect.left;
          topLeftY = popoverRect.bottom;
          topRightX = popoverRect.right;
          topRightY = popoverRect.bottom;

          bottomLeftX = anchorRect.left;
          bottomLeftY = anchorRect.top;
          bottomRightX = anchorRect.right;
          bottomRightY = anchorRect.top;
        }
      } else {
        if (anchorRect.left < popoverRect.left) {
          // Anchor is on the left
          topLeftX = anchorRect.right;
          topLeftY = anchorRect.top;
          topRightX = popoverRect.left;
          topRightY = popoverRect.top;

          bottomLeftX = anchorRect.right;
          bottomLeftY = anchorRect.bottom;
          bottomRightX = popoverRect.left;
          bottomRightY = popoverRect.bottom;
        } else {
          // Anchor is on the right
          topLeftX = popoverRect.right;
          topLeftY = popoverRect.top;
          topRightX = anchorRect.left;
          topRightY = anchorRect.top;

          bottomLeftX = popoverRect.right;
          bottomLeftY = popoverRect.bottom;
          bottomRightX = anchorRect.left;
          bottomRightY = anchorRect.bottom;
        }
      }

      this.style.setProperty('--hover-bridge-top-left-x', `${topLeftX}px`);
      this.style.setProperty('--hover-bridge-top-left-y', `${topLeftY}px`);
      this.style.setProperty('--hover-bridge-top-right-x', `${topRightX}px`);
      this.style.setProperty('--hover-bridge-top-right-y', `${topRightY}px`);
      this.style.setProperty('--hover-bridge-bottom-left-x', `${bottomLeftX}px`);
      this.style.setProperty('--hover-bridge-bottom-left-y', `${bottomLeftY}px`);
      this.style.setProperty('--hover-bridge-bottom-right-x', `${bottomRightX}px`);
      this.style.setProperty('--hover-bridge-bottom-right-y', `${bottomRightY}px`);
    }
  };

  render() {
    return html`
      <slot name="anchor" @slotchange=${this.__handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${classMap({
          'popover-hover-bridge': true,
          'popover-hover-bridge--visible': this.hoverBridge && this.active
        })}
      ></span>

      <div
        part="popover"
        class=${classMap({
          popover: true,
          'popover--active': this.active,
          'popover--fixed': this.strategy === 'fixed',
          'popover--has-arrow': this.arrow
        })}
      >
        <slot></slot>
        ${this.arrow ? html`<div part="arrow" class="popover__arrow" role="presentation"></div>` : ''}
      </div>
    `;
  }
}

