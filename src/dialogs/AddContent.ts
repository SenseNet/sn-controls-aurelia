import { IContent, Repository } from "@sensenet/client-core";
import { GenericContent, Schema } from "@sensenet/default-content-types";
import { bindable, customElement } from "aurelia-framework";
import { dialog } from "material-components-web/dist/material-components-web";

/**
 * Dialog control that can be used for creating content.
 * Usage example:
 *
 * ``` html
 *      <add-content-dialog view-model.ref="addContentDialog" parent.bind="Scope"></add-content-dialog>
 * ```
 *
 * ``` ts
 *     addContent() {
 *       this.addContentDialog.open();
 *     }
 * ```
 */
@customElement("add-content-dialog")
export class AddContentDialog {
    @bindable
    public errorMessage!: string;

    @bindable
    public isLoading!: boolean;

    @bindable
    public parent!: IContent;

    public createContentDialog!: HTMLElement;

    public createContentMDCDialog: dialog.MDCDialog;

    constructor(private repository: Repository) {
    }

    public attached() {
        this.createContentMDCDialog = new dialog.MDCDialog(this.createContentDialog);
    }

    public parentChanged() {
        this.availableSchemas = [];
    }

    @bindable
    public selectedSchema!: Schema;

    @bindable
    public newContent!: IContent;

    @bindable
    public availableSchemas: Schema[] = [];

    public selectSchema(newSchema: Schema) {
        this.selectedSchema = newSchema;
        this.newContent = {} as any;
        for (const setting of this.selectedSchema.FieldSettings) {
            if (setting.DefaultValue) {
                this.newContent[setting.Name] = setting.DefaultValue;
            }
        }
    }

    public async open() {
        // ToDo
        this.createContentMDCDialog.show();
        // this.SelectedSchema = null;
        this.isLoading = true;
        // this.errorMessage = null;
        this.newContent = null as any;

        try {
            const parent = await this.repository.load<GenericContent>({
                idOrPath: this.parent.Id,
                oDataOptions: {
                    expand: ["EffectiveAllowedChildTypes"],
                    select: ["EffectiveAllowedChildTypes"],
                },
            });
            this.isLoading = false;
            this.availableSchemas = (parent.d.EffectiveAllowedChildTypes as GenericContent[]).map((ct) => {
                    return this.repository.schemas.getSchemaByName(ct.Name as string);
                }); // .filter((ct) => ct != null);
        } catch (error) {
            this.isLoading = false;
            this.errorMessage = "There was an error loading the allowed content types." + error;
            this.availableSchemas = [];
        }
    }

    public async create() {
        this.newContent.Path = undefined as any;
        const created = await this.repository.post({
            parentPath: this.parent.Path,
            content: this.newContent,
            contentType: this.newContent.Type,
        });
        this.createContentMDCDialog.close();
    }

    public cancel() {
        this.createContentMDCDialog.close();
    }
}
