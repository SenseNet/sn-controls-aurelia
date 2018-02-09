/**
 * @module FieldControls
 *
 */ /** */

import { MDCTextField } from "@material/textfield/dist/mdc.textfield";
import { IntegerFieldSetting } from "@sensenet/default-content-types";
import { customElement } from "aurelia-framework";
import { FieldBaseControl } from "./FieldBaseControl";

/**
 * Field control for integer (whole number) fields.
 * Usage:
 *
 * ``` html
 * <integer-field content.bind="content" settings.bind="myIntegerFieldSetting"></integer-field>
 * ```
 */
@customElement("integer-field")
export class Integer extends FieldBaseControl<number, IntegerFieldSetting> {

    public textfield!: HTMLElement;
    public mdcTextField: MDCTextField;

    public attached() {
        this.mdcTextField = new MDCTextField(this.textfield);
    }
}
