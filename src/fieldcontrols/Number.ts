/**
 * @module FieldControls
 *
 */ /** */

import { MDCTextField } from "@material/textfield/dist/mdc.textfield";
import { NumberFieldSetting } from "@sensenet/default-content-types";
import { customElement } from "aurelia-framework";
import { FieldBaseControl } from "./FieldBaseControl";

/**
 * Field control for number fields.
 * Usage:
 *
 * ``` html
 * <number-field content.bind="content" settings.bind="myNumberFieldSetting"></number-field>
 * ```
 */
@customElement("number-field")
export class Number  extends FieldBaseControl<number, NumberFieldSetting> {

    public textfield!: HTMLElement;
    public mdcTextField: MDCTextField;

    public attached() {
        this.mdcTextField = new MDCTextField(this.textfield);
    }
}
