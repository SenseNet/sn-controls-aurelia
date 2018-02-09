/**
 * @module FieldControls
 *
 */ /** */

import { MDCTextField } from "@material/textfield/dist/mdc.textfield";
import { PathHelper } from "@sensenet/client-utils";
import { ShortTextFieldSetting } from "@sensenet/default-content-types";
import { autoinject, computedFrom } from "aurelia-framework";
import { customElement } from "aurelia-templating";
import { FieldBaseControl } from "./FieldBaseControl";

/**
 * Field control for Content name.
 * Usage:
 *
 * ``` html
 * <name-field content.bind="content" settings.bind="myShortTextFieldSettings"></name-field>
 * ```
 */
@autoinject
@customElement("name-field")
export class NameField extends FieldBaseControl<string, ShortTextFieldSetting> {

    public textfield!: HTMLElement;
    public mdcTextField: MDCTextField;

    @computedFrom("content")
    get parentPath(): string {
        return (this.content && this.content.Path) ? (this.content.Id) ? PathHelper.getParentPath(this.content.Path) : this.content.Path : "";
    }

    public attached() {
        this.mdcTextField = new MDCTextField(this.textfield);
    }

}
