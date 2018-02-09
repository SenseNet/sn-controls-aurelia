/**
 * @module FieldControls
 *
 */ /** */

import { MDCTextField } from "@material/textfield/dist/mdc.textfield";
import { PasswordFieldSetting } from "@sensenet/default-content-types";
import { customElement } from "aurelia-framework";
import { FieldBaseControl } from "./FieldBaseControl";

/**
 * Field control for passwords.
 * Usage:
 *
 * ``` html
 * <password-field content.bind="content" settings.bind="myPasswordFieldSetting"></password-field>
 * ```
 */
@customElement("password-field")
export class Password extends FieldBaseControl<string, PasswordFieldSetting> {
    public textfield!: HTMLElement;
    public mdcTextField: MDCTextField;

    public attached() {
        this.mdcTextField = new MDCTextField(this.textfield);
    }
}
