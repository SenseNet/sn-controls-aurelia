/**
 * @module FieldControls
 * 
 */ /** */

import { bindable, computedFrom } from 'aurelia-framework';
import { FieldBaseControl } from './FieldBaseControl';
import { FieldSettings, Content, ContentTypes, ODataHelper } from 'sn-client-js';


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
    public Content: Content;
    @bindable
    public HasAvatar: boolean = false;

    @bindable
    public IconImage: string;


    @computedFrom('Content')
    public get MaterialIconName(): string {
        return this.Content && this.Content.Icon && this.iconNames[this.Content.Icon] || 'folder';
    }

    public ContentChanged(){
        this.TryLoadAvatar();
    }


    public TryLoadAvatar(){
        if (this.Content instanceof ContentTypes.User && this.Content.ImageData && this.Content.ImageData.__mediaresource.media_src){
            this.IconImage = ODataHelper.joinPaths(this.Content.GetRepository().Config.RepositoryUrl, this.Content.ImageData.__mediaresource.media_src);
        }
    }
}