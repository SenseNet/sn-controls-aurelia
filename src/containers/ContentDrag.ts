import { DragTypes } from '../Enums';
import { bindable, customElement } from 'aurelia-framework';
import { Content } from 'sn-client-js';


@customElement('content-drag')
export class ContentDrag{

    @bindable
    public Content: Content;


    dragStart(ev: DragEvent) {
        ev.stopPropagation();
        ev.dataTransfer.setData(DragTypes.Content, this.Content.Stringify());
        ev.dataTransfer.dropEffect = 'move';
        console.log('dragStart', this.Content.Path);
        return true;
    }
    
    // dragEnd(ev: DragEvent) {
    //     ev.preventDefault();
    //     ev.stopPropagation();
    //     console.log('dragEnd ???????????', this.Content.Path);
    // }

    // dragEnter(ev: DragEvent) {
    //     ev.preventDefault();
    //     ev.stopPropagation();
    // }

    // dragOver(ev: DragEvent) {
    //     ev.preventDefault();
    //     ev.stopPropagation();
       
    //     console.log('dragOver', this.Content.Path);
    //     return true;
    // }

    // dragDrop(ev: DragEvent) {
    //     ev.preventDefault();
    //     ev.stopPropagation();
    //     if (ev.dataTransfer.types.filter(d => d === DragTypes.Content) && this.Content.Path) {
    //         const droppedContent = this.Repository.ParseContent(ev.dataTransfer.getData(DragTypes.Content));
    //         if (this.Content.Path !== droppedContent.ParentPath && this.Content.Path !== droppedContent.Path && !droppedContent.IsAncestorOf(this.Content)){
    //             droppedContent.MoveTo(this.Content.Path);
    //         }
    //     }
    //     return true;
    // }
}