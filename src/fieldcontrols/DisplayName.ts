/**
 * @module FieldControls
 *
 */ /** */

import { MDCTextField } from "@material/textfield/dist/mdc.textfield";
import { ShortTextFieldSetting } from "@sensenet/default-content-types";
import { customElement } from "aurelia-framework";
import { FieldBaseControl } from "./FieldBaseControl";

/**
 * Field control for Content DisplayNames.
 * Usage:
 *
 * ``` html
 * <display-name content.bind="content" settings.bind="myShortTextFieldSettings"></display-name>
 * ```
 */
@customElement("display-name")
export class DisplayName extends FieldBaseControl<string, ShortTextFieldSetting> {
    public textfield!: HTMLElement;
    public mdcTextField: MDCTextField;

    public attached() {
        this.mdcTextField = new MDCTextField(this.textfield);
    }
}
