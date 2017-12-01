/**
 * @module FieldControls
 * 
 */ /** */

import { bindable, computedFrom } from 'aurelia-framework';
import { FieldBaseControl } from './FieldBaseControl';
import { FieldSettings, Content, ODataHelper } from 'sn-client-js';
import { User } from 'sn-client-js/dist/src/ContentTypes';


/**
 * Control for displaying an icon
 * Usage:
 * 
 * ``` html
 * <icon icon-name.bind="content.Icon"></icon>
 * ```
 */
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
        trash: 'delete'
    }
    
    @bindable
    public content: Content<User>;
    @bindable
    public HasAvatar: boolean = false;

    @bindable
    public IconImage: string;


    @computedFrom('Content')
    public get MaterialIconName(): string {
        return this.content && this.content.Icon && this.iconNames[this.content.Icon] || 'folder';
    }

    public ContentChanged(){
        this.TryLoadAvatar();
    }


    public TryLoadAvatar(){
        if (this.content && (this.content as User).ImageData){
            if (this.content.ImageData && this.content.ImageData.__mediaresource.media_src){
                this.IconImage = ODataHelper.joinPaths(this.content.GetRepository().Config.RepositoryUrl, this.content.ImageData.__mediaresource.media_src);
            }
   
        }
    }
}