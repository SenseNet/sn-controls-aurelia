import { bindable, computedFrom } from 'aurelia-framework';
import { FieldBaseControl } from './FieldBaseControl';
import { FieldSettings } from 'sn-client-js';
export class Icon extends FieldBaseControl<string, FieldSettings.FieldSetting> {

    private iconNames = {
        Folder: 'folder',
        File: 'insert_drive_file',
        ContentType: 'code',
        User: 'person',
        Group: 'group',
        Application: 'settings',
        Settings: 'settings',
        fieldsetting: 'input',
        FormItem: 'list',
        Image: 'photo',
        image: 'photo',
        ContentList: 'list',
        Device: 'devices',
        Domain: 'domain',
        Document: 'insert_drive_file', //???

    }
    
    @bindable
    public IconName: string = 'folder';


    @computedFrom('name')
    public get MaterialIconName(): string{
        return this.iconNames[this.IconName] || 'folder';
    }
}