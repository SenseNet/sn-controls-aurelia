/**
 * @module Attributes
 * 
 */ /** */

import { DragTypes } from '../Enums';
import { bindable, autoinject } from 'aurelia-framework';
import { Content } from 'sn-client-js';



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
export class ContentDragCustomAttribute{

    @bindable({primaryProperty: true})
    content: Content[];

    dragStart: (ev: DragEvent) => boolean = (ev) => {
        ev.stopPropagation();
        if (this.content.length === 1) {
            ev.dataTransfer.setData(DragTypes.Content, this.content[0].Stringify());
        } else {
            ev.dataTransfer.setData(DragTypes.ContentList, `[${ this.content.map(c => JSON.stringify(c.Stringify())).join(',')}]`)
        }

        return true;
    }

    constructor(private element: Element) {
       this.element.setAttribute('draggable', 'true');
       this.element.addEventListener('dragstart', this.dragStart as (...args) => void);
    }
}