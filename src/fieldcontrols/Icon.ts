/**
 * @module FieldControls
 *
 */ /** */

import { Repository } from "@sensenet/client-core";
import { PathHelper } from "@sensenet/client-utils";
import { FieldSetting, User } from "@sensenet/default-content-types";
import { bindable, computedFrom } from "aurelia-framework";
import { FieldBaseControl } from "./FieldBaseControl";

/**
 * Control for displaying an icon
 * Usage:
 *
 * ``` html
 * <icon icon-name.bind="content.Icon"></icon>
 * ```
 */
export class Icon extends FieldBaseControl<string, FieldSetting> {

    private iconNames = {
        Folder: "folder",
        File: "insert_drive_file",
        ContentType: "code",
        User: "person",
        Group: "group",
        Application: "settings",
        Settings: "settings",
        fieldsetting: "input",
        FormItem: "list",
        Image: "photo",
        image: "photo",
        ContentList: "list",
        Device: "devices",
        Domain: "domain",
        Document: "insert_drive_file", // ???
        trash: "delete",
        remove: "delete",
        delete: "delete",
        copy: "content_copy",
        notification: "mail",
        security: "security",
        edit: "create",
        browse: "explore",
        download: "get_app",
        clear: "clear",
        editbinary: "code",
    };

    @bindable
    public content!: User;
    @bindable
    public hasAvatar: boolean = false;

    @bindable
    public iconImage!: string;

    @computedFrom("IconName", "fallback")
    public get MaterialIconName(): string {
        return this.iconName && (this.iconNames as any)[this.iconName] || (this.iconNames as any)[this.fallback];
    }

    @bindable
    public iconName!: string;

    @bindable
    public fallback: string = "Folder";

    /**
     *
     */
    constructor(private repostiroy: Repository) {
        super();
    }

    public contentChanged() {
        if (this.content.Icon) {
            this.iconName = this.content.Icon;
        }
    }

    public TryLoadAvatar() {
        if (this.content && (this.content as User).ImageData) {
            if (this.content.ImageData && this.content.ImageData.__mediaresource.media_src) {
                this.iconName = PathHelper.joinPaths(this.repostiroy.configuration.repositoryUrl, this.content.ImageData.__mediaresource.media_src);
            }
        }
    }
}
