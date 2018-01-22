import { customElement, bindable } from 'aurelia-framework';
import { SavedContent } from 'sn-client-js';
import { dialog } from 'material-components-web/dist/material-components-web';

@customElement('delete-content-dialog')
export class DeleteContent{
    @bindable
    contents: SavedContent[];

    @bindable
    permanently: boolean = false;

    deleteContentDialog: HTMLElement;
    deleteContentMDCDialog: dialog.MDCDialog;

    constructor(){
        
    }

    attached(){
        this.deleteContentMDCDialog = new dialog.MDCDialog(this.deleteContentDialog);
    }


    open(contents: SavedContent[]){
        this.contents = contents;
        this.permanently = false;
        this.deleteContentMDCDialog.show();
    }

    cancel(){
        this.deleteContentMDCDialog.close();
    }


    async delete(){
        this.deleteContentMDCDialog.close();
        await this.contents[0].GetRepository().DeleteBatch(this.contents, this.permanently).toPromise()
    }
}