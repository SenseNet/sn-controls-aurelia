import { IContent, IPermissionEntry, IPermissionResponseModel, Repository } from "@sensenet/client-core";
import { IActionModel, IdentityKind, PermissionLevel, ReferenceFieldSetting } from "@sensenet/default-content-types";
import { bindable, customElement } from "aurelia-framework";
import { dialog } from "material-components-web/dist/material-components-web";
import { ContentList, ContentReference } from "../index";

@customElement("set-permissions-dialog")
export class SetPermissionsDialog {
    public setPermissionsDialog!: HTMLElement;
    public setPermissionsMDCDialog: dialog.MDCDialog;

    public attached() {
        this.setPermissionsMDCDialog = new dialog.MDCDialog(this.setPermissionsDialog);
    }

    @bindable
    public ownerReferenceSchema!: ContentReference;

    @bindable
    public contentListReference!: ContentList;

    @bindable
    public permissions!: IPermissionResponseModel;

    @bindable
    public relatedIdentities: IContent[] = [];

    constructor(private repository: Repository) {

    }

    public async getListItems(): Promise<IContent[]> {
        return this.relatedIdentities;
    }

    public async open(content: IContent) {

        const ownerSettings = this.repository.schemas.getSchemaByName(content.Type).FieldSettings.find((s) => s.Name === "Owner");
        (ownerSettings as ReferenceFieldSetting).AllowedTypes = ["User"];

        this.ownerReferenceSchema.activate({
            settings: ownerSettings,
            content,
            actionName: "edit",
        });

        const [relatedIdentities, permissions] = await Promise.all([
            this.repository.security.getRelatedIdentities({
                contentIdOrPath: content.Id,
                level: PermissionLevel.AllowedOrDenied,
                kind: IdentityKind.All,
            }),
            this.repository.security.getAllPermissions(content.Id)]);
        this.permissions = permissions;

        const contentEntries: IContent[] = [];

        relatedIdentities && relatedIdentities.d && relatedIdentities.d.results.forEach((r) => {
            if (this.permissions.entries.findIndex((e) => e.identity.path === r.Path && e.propagates) > -1) {
            contentEntries.push(r);
            }
        });
        this.relatedIdentities = contentEntries;

        this.contentListReference.scope = content;

        this.setPermissionsMDCDialog.show();
    }

    @bindable
    public selectedSecurityEntry!: IContent[];

    @bindable
    public selectedPermissionEntry!: IPermissionEntry;

    @bindable
    public selectedPermissionEntryKeys: string[] = [];

    public selectedSecurityEntryChanged() {
        const newEntry: IContent = this.selectedSecurityEntry[0];
        if (newEntry) {
            // console.log("Selected security entry changed. New one: ", newEntry);
            this.selectedPermissionEntry = this.permissions.entries.find((p) => p.identity.path === newEntry.Path) as IPermissionEntry;
            this.selectedPermissionEntryKeys = Object.keys(this.selectedPermissionEntry.permissions);
        }
    }

    public getPermissionEntryActions(content: IContent): IActionModel[] {
        return [{
            ClientAction: false,
            DisplayName: "Remove permission entry",
            Icon: "clear",
            Name: "RemovePermissionEntry",
            Forbidden: false,
            Url: "",
            IncludeBackUrl: 0,
            Index: 0,
        }];
    }

    public onPermissionEntryAction(content: IContent, action: IActionModel) {
        if (action.Name === "RemovePermissionEntry") {
            this.relatedIdentities.splice(this.relatedIdentities.indexOf(content), 1);
        }
    }

}
