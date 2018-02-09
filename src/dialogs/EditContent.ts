import { IContent, Repository } from "@sensenet/client-core";
import { bindable, customElement } from "aurelia-framework";
import { dialog } from "material-components-web/dist/material-components-web";

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
@customElement("edit-content-dialog")
export class EditContentDialog {

    @bindable
    public isLoading!: boolean;

    @bindable
    public parent!: IContent;

    public editContentDialog!: HTMLElement;

    public editContentMDCDialog: dialog.MDCDialog;

    constructor(private repository: Repository) {
    }

    public attached() {
        this.editContentMDCDialog = new dialog.MDCDialog(this.editContentDialog);
    }

    @bindable
    public editedContent!: IContent;
    public async open(content: IContent) {
        this.isLoading = true;
        this.editContentMDCDialog.show();
        this.editedContent = content;
        await this.repository.load({idOrPath: this.editedContent.Id});
        this.isLoading = false;
    }

    public save() {
        this.isLoading = true;
        try {
            this.editContentMDCDialog.close();
            this.isLoading = false;
        } catch (error) {
            this.isLoading = false;
        }
    }

    public cancel() {
        this.editContentMDCDialog.close();
    }
}
