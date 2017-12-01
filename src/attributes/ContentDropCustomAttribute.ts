/**
 * @module Attributes
 * 
 */ /** */

import { DragTypes } from '../Enums';
import { bindable, autoinject } from 'aurelia-framework';

/**
 * Custom attribute that allows you to handle custom content, contentlist or file drop events on your HTML element.
 * Usage example:
 * ```html
 * <div class="my-droptarget-element" 
 *      content-drop.call="dropContent(event, stringifiedContent, stringifiedContentList, files)"></div>
 * ```
 * The defined **dropContent(..args)** method will be called on Drop events.
 * This attribute will stop the event propagation for *drag & drop* events, so it can be nested.
 */
@autoinject
export class ContentDropCustomAttribute {

    @bindable({ primaryProperty: true })
    public handler: ({ stringifiedContent, stringifiedContentList, files, event }: { stringifiedContent?: string, stringifiedContentList?: string[], files?: FileList, event?: DragEvent }) => void;

    @bindable
    public dropHover: boolean = false;

    constructor(private element: Element) {
        this.element.addEventListener('dragenter', this.dragEnter as (...args) => void);
        this.element.addEventListener('dragleave', this.dragLeave as (...args) => void);
        this.element.addEventListener('dragover', this.dragOver as (...args) => void);
        this.element.addEventListener('dragend', this.dragEnd as (...args) => void);
        this.element.addEventListener('drop', this.dragDrop as (...args) => void);
    }

    dragLeave: (ev: DragEvent) => void = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        this.dropHover = false;
    }

    dragEnd: (ev: DragEvent) => void = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        this.dropHover = false;
    }

    dragEnter: (ev: DragEvent) => void = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        this.dropHover = false;       
    }

    dragOver: (ev: DragEvent) => void = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        this.dropHover = true;
        return true;
    }

    dragDrop: (ev: DragEvent) => void = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        this.dropHover = false;

        if (ev.dataTransfer.types.filter(d => d === DragTypes.Content).length) {
            this.handler && this.handler({ event: ev, stringifiedContent: ev.dataTransfer.getData(DragTypes.Content) });
        } else if (ev.dataTransfer.types.filter(d => d === DragTypes.ContentList).length) {
            this.handler && this.handler({ event: ev, stringifiedContentList: JSON.parse(ev.dataTransfer.getData(DragTypes.ContentList)) });
        } else if (ev.dataTransfer.files.length){
            this.handler && this.handler({ event: ev, files: ev.dataTransfer.files});
        }
        return true;
    }

    dropHoverChanged() {
        if (this.dropHover){
            if (!this.element.classList.contains('dropover')){
                this.element.classList.add('dropover')
            }
        } else {
            this.element.classList.remove('dropover');
        }      
    }


}