/**
 * @module Dialogs
 * *//** */

import { customElement, bindable } from 'aurelia-framework';
import { Content, ContentInternal } from 'sn-client-js';
import { dialog } from 'material-components-web/dist/material-components-web';

/**
 * Dialog control that can be used for creating content.
 * Usage example:
 * 
 * ``` html
 *      <edit-content-dialog view-model.ref="editContentDialog" edited-content.bind="Scope"></add-content-dialog>
 * ```
 * 
 * ``` ts
 *     editContent(content: Content) {
 *       this.editContentDialog.open(content);
 *     }
 * ```
 */
@customElement('edit-content-dialog')
export class EditContentDialog {

    @bindable
    isLoading: boolean;

    @bindable
    parent: Content;

    editContentDialog: HTMLElement;

    editContentMDCDialog: dialog.MDCDialog;

    constructor() {
    }

    attached() {
        this.editContentMDCDialog = new dialog.MDCDialog(this.editContentDialog);
    }

    @bindable
    EditedContent: ContentInternal;
    async open(content: ContentInternal) {
        this.isLoading = true;
        this.editContentMDCDialog.show();
        this.EditedContent = content;
        await this.EditedContent.Reload('edit').toPromise();
        this.isLoading = false;
    }

    save() {
        this.isLoading = true;
        this.EditedContent.Save().subscribe(c => {
            this.editContentMDCDialog.close();
            this.isLoading = false;
        }, err => {
            this.isLoading = false;
        });
    }

    cancel() {
        this.editContentMDCDialog.close();
    }
}