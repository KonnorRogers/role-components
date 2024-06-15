declare const RoleTooltip_base: {
    new (...args: any[]): {
        anchor: string | Element | import("../anchored-region/anchored-region.js").VirtualElement | null;
        placement: "left" | "top" | "bottom" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "right-start" | "right-end" | "left-start" | "left-end";
        currentPlacement: "left" | "top" | "bottom" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "right-start" | "right-end" | "left-start" | "left-end" | null;
        strategy: import("@floating-ui/dom").Strategy;
        distance: number;
        skidding: number;
        arrow: boolean;
        arrowPlacement: "anchor" | "center" | "end" | "start";
        arrowPadding: number;
        flip: boolean;
        flipFallbackPlacements: string;
        flipFallbackStrategy: "best-fit" | "initial";
        flipBoundary: Element | Element[] | undefined;
        flipPadding: number;
        shift: boolean;
        shiftBoundary: Element | Element[] | undefined;
        shiftPadding: number;
        autoSize: "both" | "horizontal" | "vertical" | null;
        sync: "both" | "height" | "width" | null;
        autoSizeBoundary: Element | Element[] | undefined;
        autoSizePadding: number;
        hoverBridge: boolean;
        active: boolean;
    };
} & typeof BaseElement;
/**
 * Due to accessibility reasons with aria-describedby, the tooltip must be the same
 *   document / shadowRoot as the item being described by the tooltip.
 * @customElement
 * @tagname role-tooltip
 * @example
 *   ```js
 *   <role-tooltip id="my-tooltip">I'm a tooltip!</role-tooltip>
 *   <button data-role-tooltip="my-tooltip">Button</button>
 *   ```
 *
 * @slot - default slot
 *
 * @cssprop [--background-color=#222]
 * @cssprop [--arrow-size=8px]
 *
 * @csspart popover
 * @csspart popover--active
 * @csspart popover--fixed
 * @csspart popover--has-arrow
 * @csspart arrow
 * @csspart hover-bridge
 * @csspart hover-bridge--visible
 */
export default class RoleTooltip extends RoleTooltip_base {
    static dependencies: {
        'role-anchored-region': typeof RoleAnchoredRegion;
    };
    static get properties(): {
        role: {
            reflect: boolean;
        };
        __triggerSource: {
            attribute: boolean;
            state: boolean;
        };
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
                fromAttribute: (value: string) => string[];
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
    /** @returns {string} */
    static get baseName(): string;
    static get styles(): import("lit").CSSResult[];
    constructor();
    /**
    * @private
    * If the tooltip was trigger by focus
    * @type {null | "focus" | "hover" | "click"}
    */
    private __triggerSource;
    /**
     * @private
     */
    private __eventAbortController;
    /**
     * @type {Element[]}
     */
    __activeElements: Element[];
    /**
     * @param {RoleTooltipToggleEvent} e
     */
    handlePopoverTriggerEvent(e: RoleTooltipToggleEvent): void;
    handleReposition(): void;
    get anchoredRegion(): RoleAnchoredRegion | null;
    /**
     * @param {KeyboardEvent} e
     */
    handleKeyDown(e: KeyboardEvent): void;
    /**
     * This is a hack. Unfortunately, there's no reliable way to get the active elements from just "focusin" / "focusout"
     */
    handleFocusChange(): void;
    render(): import("lit").TemplateResult<1>;
    /**
     * Used to show from event listeners.
     * @param {Event} event
     */
    handleShow(event: Event): void;
    /**
     * @param {Element} triggerElement
     * @param {RoleTooltip["__triggerSource"]} triggerSource
     * @returns {void}
     */
    show(triggerElement: Element, triggerSource?: RoleTooltip["__triggerSource"]): void;
    /**
     * @param {Event} e
     */
    findTriggerForTooltip(e: Event): Element | null;
    /**
     * @param {import("lit").PropertyValues<this>} changedProperties
     */
    willUpdate(changedProperties: import("lit").PropertyValues<this>): void;
    /**
     * @param {Event} event
     * @returns {void}
     */
    handleHide(event: Event): void;
    /**
     * @param {null | RoleTooltip["__triggerSource"]} [triggerSource]
     * @returns {void}
     */
    hide(triggerSource?: "click" | "focus" | "hover" | null | undefined): void;
}
import { BaseElement } from "../../../internal/base-element.js";
import { RoleTooltipToggleEvent } from "../../events/role-tooltip-toggle-event.js";
import RoleAnchoredRegion from "../anchored-region/anchored-region.js";
export {};
