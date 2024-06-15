/**
 * @template {import('form-associated-helpers/exports/mixins/types.js').Constructable} T
 * @param {T} superclass
 */
export function AnchoredRegionMixin<T extends import("form-associated-helpers/exports/mixins/types.js").Constructable>(superclass: T): {
    new (...args: any[]): {
        /**
         * The element the popover will be anchored to. If the anchor lives outside of the popover, you can provide the anchor
         * element `id`, a DOM element reference, or a `VirtualElement`. If the anchor lives inside the popover, use the
         * `anchor` slot instead.
         * @type {null | Element | string | VirtualElement}
         */
        anchor: null | Element | string | VirtualElement;
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
        placement: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end';
        /**
         * The `currentPlacement` property / `current-placement` attribute are where Floating UI actually positions the popup.
        * @attr current-placement
        * @reflect
        * @type {this["placement"] | null}
        */
        currentPlacement: "left" | "top" | "bottom" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "right-start" | "right-end" | "left-start" | "left-end" | null;
        /**
          * Determines how the popover is positioned. Because you native "popover" API uses a fixed strategy, we use it as the default.
          * @attr
          * @type {import("@floating-ui/dom").Strategy}
          */
        strategy: import("@floating-ui/dom").Strategy;
        /**
          * The distance in pixels from which to offset along the "main axis". Usually its equivalent to offsetY
          * @attr
          * @type {number}
          */
        distance: number;
        /**
        * The distance in pixels from which to offset along the "cross axis". Usually its equivalent to offsetX.
        * @attr
        * @type {number}
        */
        skidding: number;
        /**
        * Attaches an arrow to the popover. The arrow's size and color can be customized using the `--arrow-size` and
        * `--background-color` custom properties. For additional customizations, you can also target the arrow using
        * `::part(arrow)` in your stylesheet.
        * @attr
        * @type {boolean}
        */
        arrow: boolean;
        /**
        * The placement of the arrow. The default is `anchor`, which will align the arrow as close to the center of the
        * anchor as possible, considering available space and `arrow-padding`. A value of `start`, `end`, or `center` will
        * align the arrow to the start, end, or center of the popover instead.
        * @attr arrow-placement
        * @type {'start' | 'end' | 'center' | 'anchor'}
        */
        arrowPlacement: 'start' | 'end' | 'center' | 'anchor';
        /**
          * The amount of padding between the arrow and the edges of the popover. If the popover has a border-radius, for example,
          * this will prevent it from overflowing the corners.
          * @attr arrow-padding
          * @type {number}
          */
        arrowPadding: number;
        /**
        * When set, placement of the popover will flip to the opposite site to keep it in view. You can use
        * `flipFallbackPlacements` to further configure how the fallback placement is determined.
        * @attr
        * @type {boolean}
        */
        flip: boolean;
        /**
        * If the preferred placement doesn't fit, popover will be tested in these fallback placements until one fits. Must be a
        * string of any number of placements separated by a space, e.g. "top bottom left". If no placement fits, the flip
        * fallback strategy will be used instead.
        * @attr flip-fallback-placements
        * @type {string}
        */
        flipFallbackPlacements: string;
        /**
        * When neither the preferred placement nor the fallback placements fit, this value will be used to determine whether
        * the popover should be positioned using the best available fit based on available space or as it was initially
        * preferred.
        * @type {'best-fit' | 'initial'}
        * @attr flip-fallback-strategy
        */
        flipFallbackStrategy: 'best-fit' | 'initial';
        /**
        * The flip boundary describes clipping element(s) that overflow will be checked relative to when flipping. By
        * default, the boundary includes overflow ancestors that will cause the element to be clipped. If needed, you can
        * change the boundary by passing a reference to one or more elements to this property.
        * @type {undefined | Element | Element[]}
        * @prop
        */
        flipBoundary: undefined | Element | Element[];
        /**
          * The amount of padding, in pixels, to exceed before the flip behavior will occur.
          * @attr flip-padding
          * @type {number}
          */
        flipPadding: number;
        /**
          * Moves the popover along the axis to keep it in view when clipped.
          * @attr
          * @type {boolean}
          */
        shift: boolean;
        /**
        * The shift boundary describes clipping element(s) that overflow will be checked relative to when shifting. By
        * default, the boundary includes overflow ancestors that will cause the element to be clipped. If needed, you can
        * change the boundary by passing a reference to one or more elements to this property.
        * @type {undefined | Element | Element[]}
        * @property
        */
        shiftBoundary: undefined | Element | Element[];
        /**
          * The amount of padding, in pixels, to exceed before the shift behavior will occur.
          * @attr shift-padding
          * @type {number}
          */
        shiftPadding: number;
        /**
          * When set, this will cause the popover to automatically resize itself to prevent it from overflowing.
          * @type {null | 'horizontal' | 'vertical' | 'both'}
          * @attr auto-size
          */
        autoSize: null | 'horizontal' | 'vertical' | 'both';
        /**
          * Syncs the popover's width or height to that of the anchor element.
          * @attr
          * @type {null | 'width' | 'height' | 'both'}
          */
        sync: null | 'width' | 'height' | 'both';
        /**
          * The auto-size boundary describes clipping element(s) that overflow will be checked relative to when resizing. By
          * default, the boundary includes overflow ancestors that will cause the element to be clipped. If needed, you can
          * change the boundary by passing a reference to one or more elements to this property.
          * @type {undefined | Element | Element[]}
          * @prop
          */
        autoSizeBoundary: undefined | Element | Element[];
        /**
          * The amount of padding, in pixels, to exceed before the auto-size behavior will occur.
          * @attr auto-size-padding
          * @type {number}
          */
        autoSizePadding: number;
        /**
          * When a gap exists between the anchor and the popover element, this option will add a "hover bridge" that fills the
          * gap using an invisible element. This makes listening for events such as `mouseenter` and `mouseleave` more sane
          * because the pointer never technically leaves the element. The hover bridge will only be drawn when the popover is
          * active.
          * @attr hover-bridge
          * @type {boolean}
          */
        hoverBridge: boolean;
        /**
         * Whether or not to show the anchored region and its host
         */
        active: boolean;
    };
} & T;
export function AnchoredRegionProperties(): {
    active: {
        type: BooleanConstructor;
        reflect: boolean;
    };
    anchor: {
        attribute: boolean;
        state: boolean;
    };
    placement: {
        reflect: boolean;
    };
    currentPlacement: {
        attribute: string;
        reflect: boolean;
    };
    strategy: {
        reflect: boolean;
    };
    distance: {
        type: NumberConstructor;
    };
    skidding: {
        type: NumberConstructor;
    };
    arrow: {
        type: BooleanConstructor;
    };
    arrowPlacement: {
        attribute: string;
    };
    arrowPadding: {
        attribute: string;
        type: NumberConstructor;
    };
    flip: {
        type: BooleanConstructor;
    };
    flipFallbackPlacements: {
        attribute: string;
        converter: {
            /**
              * @param {string} value
              */
            fromAttribute: (value: string) => string[];
            /**
              * @param {[]} value
              */
            toAttribute: (value: []) => string;
        };
    };
    flipFallbackStrategy: {
        attribute: string;
    };
    flipBoundary: {
        attribute: boolean;
        type: ObjectConstructor;
    };
    flipPadding: {
        attribute: string;
        type: NumberConstructor;
    };
    shift: {
        type: BooleanConstructor;
    };
    shiftBoundary: {
        attribute: boolean;
        type: ObjectConstructor;
    };
    shiftPadding: {
        attribute: string;
        type: NumberConstructor;
    };
    autoSize: {
        attribute: string;
    };
    sync: {};
    autoSizeBoundary: {
        type: ObjectConstructor;
    };
    autoSizePadding: {
        attribute: string;
        type: NumberConstructor;
    };
    hoverBridge: {
        attribute: string;
        type: BooleanConstructor;
    };
};
declare const RoleAnchoredRegion_base: {
    new (...args: any[]): {
        /**
         * The element the popover will be anchored to. If the anchor lives outside of the popover, you can provide the anchor
         * element `id`, a DOM element reference, or a `VirtualElement`. If the anchor lives inside the popover, use the
         * `anchor` slot instead.
         * @type {null | Element | string | VirtualElement}
         */
        anchor: string | Element | VirtualElement | null;
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
        placement: "left" | "top" | "bottom" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "right-start" | "right-end" | "left-start" | "left-end";
        /**
         * The `currentPlacement` property / `current-placement` attribute are where Floating UI actually positions the popup.
        * @attr current-placement
        * @reflect
        * @type {this["placement"] | null}
        */
        currentPlacement: "left" | "top" | "bottom" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "right-start" | "right-end" | "left-start" | "left-end" | null;
        /**
          * Determines how the popover is positioned. Because you native "popover" API uses a fixed strategy, we use it as the default.
          * @attr
          * @type {import("@floating-ui/dom").Strategy}
          */
        strategy: import("@floating-ui/dom").Strategy;
        /**
          * The distance in pixels from which to offset along the "main axis". Usually its equivalent to offsetY
          * @attr
          * @type {number}
          */
        distance: number;
        /**
        * The distance in pixels from which to offset along the "cross axis". Usually its equivalent to offsetX.
        * @attr
        * @type {number}
        */
        skidding: number;
        /**
        * Attaches an arrow to the popover. The arrow's size and color can be customized using the `--arrow-size` and
        * `--background-color` custom properties. For additional customizations, you can also target the arrow using
        * `::part(arrow)` in your stylesheet.
        * @attr
        * @type {boolean}
        */
        arrow: boolean;
        /**
        * The placement of the arrow. The default is `anchor`, which will align the arrow as close to the center of the
        * anchor as possible, considering available space and `arrow-padding`. A value of `start`, `end`, or `center` will
        * align the arrow to the start, end, or center of the popover instead.
        * @attr arrow-placement
        * @type {'start' | 'end' | 'center' | 'anchor'}
        */
        arrowPlacement: "anchor" | "center" | "end" | "start";
        /**
          * The amount of padding between the arrow and the edges of the popover. If the popover has a border-radius, for example,
          * this will prevent it from overflowing the corners.
          * @attr arrow-padding
          * @type {number}
          */
        arrowPadding: number;
        /**
        * When set, placement of the popover will flip to the opposite site to keep it in view. You can use
        * `flipFallbackPlacements` to further configure how the fallback placement is determined.
        * @attr
        * @type {boolean}
        */
        flip: boolean;
        /**
        * If the preferred placement doesn't fit, popover will be tested in these fallback placements until one fits. Must be a
        * string of any number of placements separated by a space, e.g. "top bottom left". If no placement fits, the flip
        * fallback strategy will be used instead.
        * @attr flip-fallback-placements
        * @type {string}
        */
        flipFallbackPlacements: string;
        /**
        * When neither the preferred placement nor the fallback placements fit, this value will be used to determine whether
        * the popover should be positioned using the best available fit based on available space or as it was initially
        * preferred.
        * @type {'best-fit' | 'initial'}
        * @attr flip-fallback-strategy
        */
        flipFallbackStrategy: "best-fit" | "initial";
        /**
        * The flip boundary describes clipping element(s) that overflow will be checked relative to when flipping. By
        * default, the boundary includes overflow ancestors that will cause the element to be clipped. If needed, you can
        * change the boundary by passing a reference to one or more elements to this property.
        * @type {undefined | Element | Element[]}
        * @prop
        */
        flipBoundary: Element | Element[] | undefined;
        /**
          * The amount of padding, in pixels, to exceed before the flip behavior will occur.
          * @attr flip-padding
          * @type {number}
          */
        flipPadding: number;
        /**
          * Moves the popover along the axis to keep it in view when clipped.
          * @attr
          * @type {boolean}
          */
        shift: boolean;
        /**
        * The shift boundary describes clipping element(s) that overflow will be checked relative to when shifting. By
        * default, the boundary includes overflow ancestors that will cause the element to be clipped. If needed, you can
        * change the boundary by passing a reference to one or more elements to this property.
        * @type {undefined | Element | Element[]}
        * @property
        */
        shiftBoundary: Element | Element[] | undefined;
        /**
          * The amount of padding, in pixels, to exceed before the shift behavior will occur.
          * @attr shift-padding
          * @type {number}
          */
        shiftPadding: number;
        /**
          * When set, this will cause the popover to automatically resize itself to prevent it from overflowing.
          * @type {null | 'horizontal' | 'vertical' | 'both'}
          * @attr auto-size
          */
        autoSize: "both" | "horizontal" | "vertical" | null;
        /**
          * Syncs the popover's width or height to that of the anchor element.
          * @attr
          * @type {null | 'width' | 'height' | 'both'}
          */
        sync: "both" | "height" | "width" | null;
        /**
          * The auto-size boundary describes clipping element(s) that overflow will be checked relative to when resizing. By
          * default, the boundary includes overflow ancestors that will cause the element to be clipped. If needed, you can
          * change the boundary by passing a reference to one or more elements to this property.
          * @type {undefined | Element | Element[]}
          * @prop
          */
        autoSizeBoundary: Element | Element[] | undefined;
        /**
          * The amount of padding, in pixels, to exceed before the auto-size behavior will occur.
          * @attr auto-size-padding
          * @type {number}
          */
        autoSizePadding: number;
        /**
          * When a gap exists between the anchor and the popover element, this option will add a "hover bridge" that fills the
          * gap using an invisible element. This makes listening for events such as `mouseenter` and `mouseleave` more sane
          * because the pointer never technically leaves the element. The hover bridge will only be drawn when the popover is
          * active.
          * @attr hover-bridge
          * @type {boolean}
          */
        hoverBridge: boolean;
        /**
         * Whether or not to show the anchored region and its host
         */
        active: boolean;
    };
} & typeof BaseElement;
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
export default class RoleAnchoredRegion extends RoleAnchoredRegion_base {
    static styles: import("lit").CSSResult[];
    static properties: {
        active: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        anchor: {
            attribute: boolean;
            state: boolean;
        };
        placement: {
            reflect: boolean;
        };
        currentPlacement: {
            attribute: string;
            reflect: boolean;
        };
        strategy: {
            reflect: boolean;
        };
        distance: {
            type: NumberConstructor;
        };
        skidding: {
            type: NumberConstructor;
        };
        arrow: {
            type: BooleanConstructor;
        };
        arrowPlacement: {
            attribute: string;
        };
        arrowPadding: {
            attribute: string;
            type: NumberConstructor;
        };
        flip: {
            type: BooleanConstructor;
        };
        flipFallbackPlacements: {
            attribute: string;
            converter: {
                /**
                  * @param {string} value
                  */
                fromAttribute: (value: string) => string[];
                /**
                  * @param {[]} value
                  */
                toAttribute: (value: []) => string;
            };
        };
        flipFallbackStrategy: {
            attribute: string;
        };
        flipBoundary: {
            attribute: boolean;
            type: ObjectConstructor;
        };
        flipPadding: {
            attribute: string;
            type: NumberConstructor;
        };
        shift: {
            type: BooleanConstructor;
        };
        shiftBoundary: {
            attribute: boolean;
            type: ObjectConstructor;
        };
        shiftPadding: {
            attribute: string;
            type: NumberConstructor;
        };
        autoSize: {
            attribute: string;
        };
        sync: {};
        autoSizeBoundary: {
            type: ObjectConstructor;
        };
        autoSizePadding: {
            attribute: string;
            type: NumberConstructor;
        };
        hoverBridge: {
            attribute: string;
            type: BooleanConstructor;
        };
    };
    constructor();
    /**
    * @internal
    * @type {Element | VirtualElement | null}
    */
    __anchorEl: Element | VirtualElement | null;
    /**
    * @internal
    * @type {ReturnType<typeof autoUpdate> | undefined}
    */
    __cleanup: ReturnType<typeof autoUpdate> | undefined;
    connectedCallback(): Promise<void>;
    /**
     * @param {import('lit').PropertyValues<this>} changedProps
     */
    willUpdate(changedProps: import('lit').PropertyValues<this>): void;
    /**
     * @param {import('lit').PropertyValues<this>} changedProps
     */
    updated(changedProps: import('lit').PropertyValues<this>): Promise<void>;
    /**
     * A reference to the internal popover container. Useful for animating and styling the popover with JavaScript.
     *
     */
    get popoverElement(): HTMLElement | null;
    get arrowElement(): HTMLElement | null;
    /**
     * @internal
     */
    __handleAnchorChange(): Promise<void>;
    /**
     * @internal
     */
    __start(): void;
    cleanup: (() => void) | undefined;
    /**
     * @internal
     * @returns {Promise<void>}
     */
    __stop(): Promise<void>;
    /** Forces the popover to recalculate and reposition itself. */
    reposition(): void;
    updateHoverBridge: () => void;
    render(): import("lit").TemplateResult<1>;
}
export type VirtualElement = {
    getBoundingClientRect: () => DOMRect;
    contextElement?: Element | undefined;
};
import { BaseElement } from "../../../internal/base-element.js";
import { autoUpdate } from '@floating-ui/dom';
export {};
