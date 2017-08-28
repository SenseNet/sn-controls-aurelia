import { DragTypes } from '../Enums';
import { bindable, customElement } from 'aurelia-framework';


@customElement('content-drop')
export class ContentDrop{

    @bindable
    public DropHandler: ({stringifiedContent: string}) => void;


    dragEnd(ev: DragEvent) {
        ev.preventDefault();
        ev.stopPropagation();
    }

    dragEnter(ev: DragEvent) {
        ev.preventDefault();
        ev.stopPropagation();
    }

    dragOver(ev: DragEvent) {
        ev.preventDefault();
        ev.stopPropagation();
        return true;
    }

    dragDrop(ev: DragEvent) {
        ev.preventDefault();
        ev.stopPropagation();
        if (ev.dataTransfer.types.filter(d => d === DragTypes.Content)) {
            this.DropHandler && this.DropHandler({stringifiedContent: ev.dataTransfer.getData(DragTypes.Content)});
        }
        return true;
    }
}