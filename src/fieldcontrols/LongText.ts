/**
 * @module FieldControls
 *
 */ /** */

import { MDCTextField } from "@material/textfield/dist/mdc.textfield";
import { LongTextFieldSetting } from "@sensenet/default-content-types";
import { customElement } from "aurelia-framework";
import { FieldBaseControl } from "./FieldBaseControl";

/**
 * Field control for unformatted long text (textarea).
 * Usage:
 *
 * ``` html
 * <long-text content.bind="content" settings.bind="myLongTextFieldSetting"></long-text>
 * ```
 */
@customElement("long-text")
export class LongText extends FieldBaseControl<string, LongTextFieldSetting> {

    public textfield!: HTMLElement;
    public mdcTextField: MDCTextField;

    public attached() {
        this.mdcTextField = new MDCTextField(this.textfield);
    }
}
