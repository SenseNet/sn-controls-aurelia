import { IContent, Repository } from "@sensenet/client-core";
import { bindable, customElement } from "aurelia-framework";
import { dialog } from "material-components-web/dist/material-components-web";

@customElement("delete-content-dialog")
export class DeleteContent {
    @bindable
    public contents!: IContent[];

    @bindable
    public permanently: boolean = false;

    public deleteContentDialog!: HTMLElement;
    public deleteContentMDCDialog: dialog.MDCDialog;

    constructor(private repository: Repository) {

    }

    public attached() {
        this.deleteContentMDCDialog = new dialog.MDCDialog(this.deleteContentDialog);
    }

    public open(contents: IContent[]) {
        this.contents = contents;
        this.permanently = false;
        this.deleteContentMDCDialog.show();
    }

    public cancel() {
        this.deleteContentMDCDialog.close();
    }

    public async delete() {
        this.deleteContentMDCDialog.close();
        await this.repository.delete({
            idOrPath: this.contents.map((a) => a.Path),
            permanent: this.permanently,
        });
    }
}
