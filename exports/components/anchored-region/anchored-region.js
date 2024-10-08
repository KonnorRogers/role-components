import { arrow, autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import { classMap } from 'lit/directives/class-map.js';
import { html, css } from 'lit';
import { BaseElement } from "../../../internal/base-element.js";
import { hostStyles } from "../../styles/host-styles.js";
import { stringMap } from '../../../internal/string-map.js';
import { RoleRepositionEvent } from '../../events/role-reposition-event.js';
import { ifDefined } from 'lit/directives/if-defined.js';

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
 * @template {import('form-associated-helpers/exports/mixins/types.js').Constructable} T
 * @param {T} superclass
 */
export function AnchoredRegionMixin (superclass) {
  return class __AnchoredRegionMixin__ extends superclass {
    /**
     * @param {any[]} args
     */
    constructor (...args) {
      super(...args)

      /**
       * The element the popover will be anchored to. If the anchor lives outside of the popover, you can provide the anchor
       * element `id`, a DOM element reference, or a `VirtualElement`. If the anchor lives inside the popover, use the
       * `anchor` slot instead.
       * @type {null | Element | string | VirtualElement}
       */
      this.anchor = this.anchor ?? null

      /**
        * The preferred placement of the popover. Note that the actual placement will vary as configured to keep the
        * panel inside of the viewport.
        * @attr
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
      this.placement = this.placement ?? "top"

      /**
       * The `currentPlacement` property / `current-placement` attribute are where Floating UI actually positions the popup.
      * @attr current-placement
      * @reflect
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
          | null
        }
      */
      this.currentPlacement = this.placement ?? null

      /**
        * Determines how the popover is positioned. Because you native "popover" API uses a fixed strategy, we use it as the default.
        * @attr
        * @reflect
        * @type {import("@floating-ui/dom").Strategy}
        */
      this.strategy = this.strategy ?? "fixed"

      /**
        * The distance in pixels from which to offset along the "main axis". Usually its equivalent to offsetY
        * @attr
        * @type {number}
        */
      this.distance = this.distance ?? 0;

      /**
      * The distance in pixels from which to offset along the "cross axis". Usually its equivalent to offsetX.
      * @attr
      * @type {number}
      */
      this.skidding = this.skidding ?? 0;

      /**
      * Attaches an arrow to the popover. The arrow's size and color can be customized using the `--arrow-size` and
      * `--background-color` custom properties. For additional customizations, you can also target the arrow using
      * `::part(arrow)` in your stylesheet.
      * @attr
      * @type {boolean}
      */
      this.arrow = this.arrow ?? false;

      /**
      * The placement of the arrow. The default is `anchor`, which will align the arrow as close to the center of the
      * anchor as possible, considering available space and `arrow-padding`. A value of `start`, `end`, or `center` will
      * align the arrow to the start, end, or center of the popover instead.
      * @attr arrow-placement
      * @type {'start' | 'end' | 'center' | 'anchor'}
      */
      this.arrowPlacement = this.arrowPlacement ?? 'anchor';

      /**
        * The amount of padding between the arrow and the edges of the popover. If the popover has a border-radius, for example,
        * this will prevent it from overflowing the corners.
        * @attr arrow-padding
        * @type {number}
        */
      this.arrowPadding = this.arrowPadding ?? 10

      /**
      * When set, placement of the popover will flip to the opposite site to keep it in view. You can use
      * `flipFallbackPlacements` to further configure how the fallback placement is determined.
      * @attr
      * @type {boolean}
      */
      this.flip = this.flip ?? true;

      /**
      * If the preferred placement doesn't fit, popover will be tested in these fallback placements until one fits. Must be a
      * string of any number of placements separated by a space, e.g. "top bottom left". If no placement fits, the flip
      * fallback strategy will be used instead.
      * @attr flip-fallback-placements
      * @type {string}
      */
      this.flipFallbackPlacements = this.flipFallbackPlacements ?? '';

      /**
      * When neither the preferred placement nor the fallback placements fit, this value will be used to determine whether
      * the popover should be positioned using the best available fit based on available space or as it was initially
      * preferred.
      * @type {'best-fit' | 'initial'}
      * @attr flip-fallback-strategy
      */
      this.flipFallbackStrategy = this.flipFallbackStrategy ?? 'best-fit';

      /**
      * The flip boundary describes clipping element(s) that overflow will be checked relative to when flipping. By
      * default, the boundary includes overflow ancestors that will cause the element to be clipped. If needed, you can
      * change the boundary by passing a reference to one or more elements to this property.
      * @type {undefined | Element | Element[]}
      * @prop
      */
      this.flipBoundary = this.flipBoundary ?? undefined

      /**
        * The amount of padding, in pixels, to exceed before the flip behavior will occur.
        * @attr flip-padding
        * @type {number}
        */
      this.flipPadding = this.flipPadding ?? 0;

      /**
        * Moves the popover along the axis to keep it in view when clipped.
        * @attr
        * @type {boolean}
        */
      this.shift = this.shift ?? true;


      /**
      * The shift boundary describes clipping element(s) that overflow will be checked relative to when shifting. By
      * default, the boundary includes overflow ancestors that will cause the element to be clipped. If needed, you can
      * change the boundary by passing a reference to one or more elements to this property.
      * @type {undefined | Element | Element[]}
      * @property
      */
      this.shiftBoundary = this.shiftBoundary ?? undefined

      /**
        * The amount of padding, in pixels, to exceed before the shift behavior will occur.
        * @attr shift-padding
        * @type {number}
        */
      this.shiftPadding = this.shiftPadding ?? 0;

      /**
        * When set, this will cause the popover to automatically resize itself to prevent it from overflowing.
        * @type {null | 'horizontal' | 'vertical' | 'both'}
        * @attr auto-size
        */
      this.autoSize = this.autoSize ?? null

      /**
        * Syncs the popover's width or height to that of the anchor element.
        * @attr
        * @type {null | 'width' | 'height' | 'both'}
        */
      this.sync = this.sync ?? null

      /**
        * The auto-size boundary describes clipping element(s) that overflow will be checked relative to when resizing. By
        * default, the boundary includes overflow ancestors that will cause the element to be clipped. If needed, you can
        * change the boundary by passing a reference to one or more elements to this property.
        * @type {undefined | Element | Element[]}
        * @prop
        */
      this.autoSizeBoundary = this.autoSizeBoundary ?? undefined

      /**
        * The amount of padding, in pixels, to exceed before the auto-size behavior will occur.
        * @attr auto-size-padding
        * @type {number}
        */
      this.autoSizePadding = this.autoSizePadding ?? 0;

      /**
        * When a gap exists between the anchor and the popover element, this option will add a "hover bridge" that fills the
        * gap using an invisible element. This makes listening for events such as `mouseenter` and `mouseleave` more sane
        * because the pointer never technically leaves the element. The hover bridge will only be drawn when the popover is
        * active.
        * @attr hover-bridge
        * @type {boolean}
        */
      this.hoverBridge = this.hoverBridge ?? true

      /**
       * Whether or not to show the anchored region and its host
       */
      this.active = this.active ?? false

      /**
       * The type of popover to use for anchoring. Default is "auto". If "none", will not use "popover" for top layer.
       * @type {"auto" | "manual" | "none"}
       */
      this.anchoredPopoverType = this.anchoredPopoverType ?? "auto"
    }
  }
}

export const AnchoredRegionProperties = () => /** @const */ ({
  active: { type: Boolean, reflect: true },
  anchor: { attribute: false, state: true },
  placement: { reflect: true },
  currentPlacement: { attribute: "current-placement", reflect: true },
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
  flipBoundary: { attribute: false, type: Object },
  flipPadding: { attribute: 'flip-padding', type: Number },
  shift: { type: Boolean },
  shiftBoundary: { attribute: false, type: Object },
  shiftPadding: { attribute: 'shift-padding', type: Number },
  autoSize: { attribute: 'auto-size' },
  sync: {},
  autoSizeBoundary: { type: Object },
  autoSizePadding: { attribute: 'auto-size-padding', type: Number },
  hoverBridge: { attribute: 'hover-bridge', type: Boolean },
  anchoredPopoverType: { attribute: "anchored-popover-type", reflect: true }
})


/**
 * `<anchored-region>` is a declarative way of declarign floating elements. It is an alternative until anchored-positioning in CSS gets better support.
 * @customelement
 * @tagname role-anchored-region
 * @documentation https://role-components.vercel.app/components/anchored-region
 * @status experimental
 * @since 3.0
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
export default class RoleAnchoredRegion extends AnchoredRegionMixin(BaseElement) {
  static baseName = "role-anchored-region"
  static styles =  [
    hostStyles,
    css`
      :host {
        --__background: var(--background, #222);
        --__border-color: var(--border-color, #222);
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

      [part~="popover"] {
        position: absolute;
        isolation: isolate;
        max-width: var(--auto-size-available-width, none);
        max-height: var(--auto-size-available-height, none);
        border: var(--__border-width) solid var(--__border-color);
        background: var(--__background);
      }

      [popover] {
        position: fixed;
      	border: none;
	background: none;
	inset: unset;
	color: inherit;
	margin: 0;
	padding: 0;
      }

      [part~="popover--fixed"] {
        position: fixed;
      }

      [part~="arrow"] {
        position: absolute;
        width: calc(var(--arrow-size-diagonal) * 2);
        height: calc(var(--arrow-size-diagonal) * 2);
        background: var(--__background);
        /* background: tomato; */
        z-index: -1;
        margin: 0;
        transform-style: preserve-3d;
        border: var(--__border-width) solid var(--__border-color);
        border-top-color: transparent;
        border-right-color: transparent;
      }

      /* Hover bridge */
      [part~="hover-bridge"]:not([part~="hover-bridge--visible"]) {
        display: none;
      }

      [part~="hover-bridge"] {
        /* background: tomato; */
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

      :host([current-placement="top"]) [part~="arrow"] {
        transform: rotate(315deg);
      }

      :host([current-placement="bottom"]) [part~="arrow"] {
        transform: rotate(135deg);
      }

      :host([current-placement="left"]) [part~="arrow"] {
        transform: rotate(225deg);
      }

      :host([current-placement="right"]) [part~="arrow"] {
        transform: rotate(45deg);
      }
    `
  ];

  static properties = {
    ...(AnchoredRegionProperties()),
  }

  constructor () {
    super()

    // Needed by floating-ui
    // @ts-expect-error
    if (window.process == null) window.process = {};
    // @ts-expect-error
    if (window.process.env == null) window.process.env = "development";


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
  willUpdate(changedProps) {
    super.willUpdate(changedProps)
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
  }

  /**
   * @param {import('lit').PropertyValues<this>} changedProps
   */
  async updated(changedProps) {
    super.updated(changedProps);

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
    return /** @type {null | HTMLElement} */ (this.shadowRoot?.querySelector('[part~="popover"]') || null)
  }

  get arrowElement () {
    return /** @type {null | HTMLElement} */ (this.shadowRoot?.querySelector('[part~="arrow"]') || null)
  }

  /**
   * @internal
   */
  async __handleAnchorChange() {
    await this.__stop();

    if (this.anchor && typeof this.anchor === 'string') {
      // Locate the anchor by id
      const root = /** @type {Document | ShadowRoot} */ (this.getRootNode())
      this.__anchorEl = root.getElementById(this.anchor);
    } else if (this.anchor instanceof Element || isVirtualElement(this.anchor)) {
      // Use the anchor's reference
      this.__anchorEl = /** @type {Element | VirtualElement} */ (this.anchor);
    } else {
      // Look for a slotted anchor
      this.__anchorEl = /** @type {HTMLElement} */ (this.querySelector('[slot="anchor"]'));
    }

    // If the anchor is a <slot>, we'll use the first assigned element as the target since slots use `display: contents`
    // and positioning can't be calculated on them
    if (this.__anchorEl instanceof HTMLSlotElement) {
      this.__anchorEl = /** @type {HTMLElement} */ (this.__anchorEl.assignedElements({ flatten: true })[0])
    }

    // If the anchor is valid, start it up
    if (this.__anchorEl) {
      this.__start();
    }
  }

  /**
   * @internal
   */
  __start() {
    // We can't start the positioner without an anchor
    if (!this.__anchorEl) {
      return;
    }

    if (!this.popoverElement) {
      return
    }

    this.__togglePopover__()

    this.cleanup = autoUpdate(this.__anchorEl, this.popoverElement, () => {
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
        this.currentPlacement = null
        this.style.removeProperty('--auto-size-available-width');
        this.style.removeProperty('--auto-size-available-height');
        requestAnimationFrame(() => {
          resolve()
          this.__togglePopover__()
        });
      } else {
        this.__togglePopover__()
        resolve();
      }

    });
  }

  __togglePopover__ () {
    /**
     * @type {HTMLElement | null}
     */
    const popover = this.shadowRoot?.querySelector("[popover]") || null

    if (popover) {
      if (this.active) {
        try {
        popover.showPopover()
        } catch (_) {}
      } else {
        try {
        popover.hidePopover()
        } catch (_) {}
      }
    }

  }

  /** Forces the popover to recalculate and reposition itself. */
  reposition() {
    const popoverElement = this.popoverElement
    // Nothing to do if the popover is inactive or the anchor doesn't exist
    if (!this.active || !this.__anchorEl || !popoverElement) {
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
            popoverElement.style.width = syncWidth ? `${rects.reference.width}px` : '';
            popoverElement.style.height = syncHeight ? `${rects.reference.height}px` : '';
          }
        })
      );
    } else {
      // Cleanup styles if we're not matching width/height
      popoverElement.style.width = '';
      popoverElement.style.height = '';
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
    if (this.arrow && this.arrowElement) {
      middleware.push(
        arrow({
          element: this.arrowElement,
          padding: this.arrowPadding
        })
      );
    }

    //
    // Use custom positioning logic if the strategy is absolute. Otherwise, fall back to the default logic.
    //
    // More info: https://github.com/shoelace-style/shoelace/issues/1135

    computePosition(this.__anchorEl, popoverElement, {
      placement: this.placement,
      middleware,
      strategy: this.strategy,
    }).then(({ x, y, middlewareData, placement }) => {
      //
      // Even though we have our own localization utility, it uses different heuristics to determine RTL. Because of
      // that, we'll use the same approach that Floating UI uses.
      //
      // Source: https://github.com/floating-ui/floating-ui/blob/cb3b6ab07f95275730d3e6e46c702f8d4908b55c/packages/dom/src/utils/getDocumentRect.ts#L31
      //
      const isRtl = getComputedStyle(this).direction === 'rtl';

      this.currentPlacement = placement

      const staticSide = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }[placement.split('-')[0]] || this.placement;


      Object.assign(popoverElement.style, {
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

        if (this.arrowElement) {
          Object.assign(this.arrowElement.style, {
            top,
            right,
            bottom,
            left,
            [staticSide]: 'calc(var(--arrow-size-diagonal) * -1)'
          });
        }
      }
    });

    // Wait until the new position is drawn before updating the hover bridge, otherwise it can get out of sync
    requestAnimationFrame(() => this.updateHoverBridge());

    /** @ignore */
    this.dispatchEvent(new RoleRepositionEvent());
  }

  updateHoverBridge = () => {
    if (this.hoverBridge && this.__anchorEl && this.popoverElement) {
      const anchorRect = this.__anchorEl.getBoundingClientRect();
      const popoverRect = this.popoverElement.getBoundingClientRect();
      const isVertical = (this.currentPlacement?.includes('top') || this.currentPlacement?.includes('bottom')) ?? true;
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
        if (this.currentPlacement?.includes("left")) {
          // Anchor is on the left
          topLeftX = popoverRect.right;
          topLeftY = popoverRect.top;
          topRightX = anchorRect.right;
          topRightY = anchorRect.top;

          bottomLeftX = popoverRect.right;
          bottomLeftY = popoverRect.bottom;
          bottomRightX = anchorRect.right;
          bottomRightY = anchorRect.bottom;
        } else {
          // Anchor is on the right
          topLeftX = anchorRect.left;
          topLeftY = anchorRect.top;
          topRightX = popoverRect.left;
          topRightY = popoverRect.top;

          bottomLeftX = anchorRect.left;
          bottomLeftY = anchorRect.bottom;
          bottomRightX = popoverRect.left;
          bottomRightY = popoverRect.bottom;
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

      <div
        part="popover-base"
        popover=${ifDefined(this.anchoredPopoverType === "none" ? null : this.anchoredPopoverType)}
      >
        <span
          part=${stringMap({
            'hover-bridge': true,
            'hover-bridge--visible': this.hoverBridge && this.active
          })}
        ></span>

        <div
          part=${stringMap({
            popover: true,
            'popover--active': this.active,
            'popover--fixed': this.strategy === 'fixed',
            'popover--has-arrow': this.arrow,
          })}
          class=${classMap({
            'visually-hidden': !this.active
          })}
        >
          <slot></slot>
          ${this.arrow ? html`<div part="arrow" role="presentation"></div>` : ''}
        </div>
      </div>
    `;
  }
}

