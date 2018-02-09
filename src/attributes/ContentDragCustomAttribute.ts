/**
 * @module Attributes
 *
 */ /** */

import { IContent } from "@sensenet/client-core";
import { autoinject, bindable } from "aurelia-framework";
import { DragTypes } from "../Enums";

/**
 * Custom attribute that allows you to handle custom content or contentlist drag events on your HTML element.
 * Usage example:
 * ```html
 * <div class="my-draggable-contentlist-element"
 *      content-drag.bind="[draggableContent1, draggableContent2]"></div>
 * ```
 * The defined *content array* should contain Content items with a valid Stringify() method.
 * This attribute will stop the event propagation for *drag & drop* events, so it can be nested.
 */
@autoinject
export class ContentDragCustomAttribute {

    @bindable({ primaryProperty: true })
    public content!: IContent[];

    public dragStart: (ev: DragEvent) => boolean = (ev) => {
        ev.stopPropagation();
        if (this.content.length === 1) {
            ev.dataTransfer.setData(DragTypes.Content, JSON.stringify(this.content[0]));
        } else {
            ev.dataTransfer.setData(DragTypes.ContentList, `[${this.content.map((c) => JSON.stringify(JSON.stringify(c))).join(",")}]`);
        }

        return true;
    }

    constructor(private element: Element) {
        this.element.setAttribute("draggable", "true");
        this.element.addEventListener("dragstart", this.dragStart as (...args: any[]) => void);
    }
}
