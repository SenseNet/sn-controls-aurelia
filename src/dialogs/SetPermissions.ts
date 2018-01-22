import { customElement, bindable } from 'aurelia-framework';
import { dialog } from 'material-components-web/dist/material-components-web';
import { ContentInternal, SavedContent, Content } from 'sn-client-js';
import { PermissionLevel, IdentityKind } from 'sn-client-js/dist/src/Security';
import { ContentReference, ContentList } from '../index';
import { ReferenceFieldSetting } from 'sn-client-js/dist/src/FieldSettings';
import { PermissionResponseModel, PermissionEntry } from 'sn-client-js/dist/src/Repository/PermissionModel';
import { ActionModel } from 'sn-client-js/dist/src/Repository';


@customElement('set-permissions-dialog')
export class SetPermissionsDialog {
    setPermissionsDialog: HTMLElement;
    setPermissionsMDCDialog: dialog.MDCDialog;

    attached(){
        this.setPermissionsMDCDialog = new dialog.MDCDialog(this.setPermissionsDialog);
    }

    @bindable
    public ownerReferenceSchema: ContentReference;

    @bindable
    public contentListReference: ContentList;

    @bindable
    permissions: PermissionResponseModel;

    @bindable
    relatedIdentities: Content[] = [];



    async getListItems(): Promise<SavedContent[]>{
        return this.relatedIdentities;
    }

    async open(content: ContentInternal){

        content.GetActions()
       
        const ownerSettings = content.GetSchema().FieldSettings.find(s => s.Name === 'Owner');
        (ownerSettings as ReferenceFieldSetting).AllowedTypes = ['User'];

        this.ownerReferenceSchema.activate({
            settings: ownerSettings,
            content,
            actionName: 'edit'
        })

        const [relatedIdentities, permissions] = await Promise.all([
            content.GetRelatedIdentities(PermissionLevel.AllowedOrDenied, IdentityKind.All).toPromise(), 
            content.GetPermissions().toPromise()]);
        this.permissions = permissions;

        const contentEntries: SavedContent[] = []

        relatedIdentities.d.results.forEach(r => {
            if (this.permissions.entries.findIndex(e => e.identity.path === r.Path && e.propagates) > -1)
            contentEntries.push(content.GetRepository().HandleLoadedContent(r))
        });
        this.relatedIdentities = contentEntries;

        this.contentListReference.Scope = content;

        this.setPermissionsMDCDialog.show();
    }

    @bindable
    selectedSecurityEntry: Content[]

    @bindable
    selectedPermissionEntry: PermissionEntry;

    @bindable
    selectedPermissionEntryKeys: string[] = []

    selectedSecurityEntryChanged(){
        const newEntry: Content = this.selectedSecurityEntry[0];
        if (newEntry){
            console.log('Selected security entry changed. New one: ', newEntry);
            this.selectedPermissionEntry = this.permissions.entries.find(p => p.identity.path === newEntry.Path) as PermissionEntry;
            this.selectedPermissionEntryKeys = Object.keys(this.selectedPermissionEntry.permissions);
        }
    }

    getPermissionEntryActions(content: Content): ActionModel[]{
        return [{
            ClientAction: false,
            DisplayName: 'Remove permission entry',
            Icon: 'clear',
            Name: 'RemovePermissionEntry',
            Forbidden: false,
            Url: '',
            IncludeBackUrl: 0,
            Index: 0
        }]
    }

    onPermissionEntryAction(content: Content, action: ActionModel){
        if (action.Name === 'RemovePermissionEntry'){
            this.relatedIdentities.splice(this.relatedIdentities.indexOf(content), 1);
        }
    }

}