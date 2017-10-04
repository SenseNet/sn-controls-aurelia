import { DragTypes } from '../Enums';
import { bindable, autoinject } from 'aurelia-framework';


@autoinject
export class ContentDropCustomAttribute {

    @bindable({ primaryProperty: true })
    public handler: ({ stringifiedContent, stringifiedContentList }: { stringifiedContent?: string, stringifiedContentList?: string[] }) => void;

    constructor(private element: Element) {
        this.element.addEventListener('dragenter', this.dragEnter);
        this.element.addEventListener('dragover', this.dragOver);
        this.element.addEventListener('dragend', this.dragEnd);
        this.element.addEventListener('drop', this.dragDrop);
    }


    dragEnd: (ev: DragEvent) => void = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
    }

    dragEnter: (ev: DragEvent) => void = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
    }

    dragOver: (ev: DragEvent) => void = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        return true;
    }

    dragDrop: (ev: DragEvent) => void = (ev) => {
        {
            ev.preventDefault();
            ev.stopPropagation();
            if (ev.dataTransfer.types.filter(d => d === DragTypes.Content).length) {
                this.handler && this.handler({ stringifiedContent: ev.dataTransfer.getData(DragTypes.Content) });
            } else if (ev.dataTransfer.types.filter(d => d === DragTypes.ContentList).length) {
                this.handler && this.handler({ stringifiedContentList: JSON.parse(ev.dataTransfer.getData(DragTypes.ContentList)) });
            }
            return true;
        }
    }
}