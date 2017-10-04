import { DragTypes } from '../Enums';
import { bindable, autoinject } from 'aurelia-framework';
import { Content } from 'sn-client-js';

@autoinject
export class ContentDragCustomAttribute{

    @bindable({primaryProperty: true})
    content: Content[];

    dragStart: (ev: DragEvent) => boolean = (ev) => {
        ev.stopPropagation();
        ev.dataTransfer.dropEffect = 'move';
        if (this.content.length === 1) {
            ev.dataTransfer.setData(DragTypes.Content, this.content[0].Stringify());
        } else {
            ev.dataTransfer.setData(DragTypes.ContentList, `[${ this.content.map(c => JSON.stringify(c.Stringify())).join(',')}]`)
        }

        return true;
    }

    constructor(private element: Element) {
       this.element.setAttribute('draggable', 'true');
       this.element.addEventListener('dragstart', this.dragStart);
    }
}