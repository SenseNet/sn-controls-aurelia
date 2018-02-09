/**
 * @module FieldControls
 *
 */ /** */

import { customElement } from "aurelia-framework";

import { ValidationRules } from "aurelia-validation";
import { FieldBaseControl } from "./FieldBaseControl";

import { MDCTextField } from "@material/textfield/dist/mdc.textfield";
import { ShortTextFieldSetting } from "@sensenet/default-content-types";

/**
 * Field control for general Short Text fields.
 * Usage:
 *
 * ``` html
 * <short-text content.bind="content" settings.bind="myShortTextFieldSettings"></short-text>
 * ```
 */
@customElement("short-text")
export class ShortText extends FieldBaseControl<string, ShortTextFieldSetting> {

    get rules(): any {
        const parentRules = super.rules;

        const thisRules = this.settings && ValidationRules
            .ensure("value")
                .minLength(this.settings.MinLength || 0)
                .maxLength(this.settings.MaxLength || Infinity)
                .matches(this.settings.Regex && new RegExp(this.settings.Regex) || new RegExp("")).rules || [];
        return [...parentRules, ...thisRules];
    }

    public textfield!: HTMLElement;
    public mdcTextField: MDCTextField;

    public attached() {
        this.mdcTextField = new MDCTextField(this.textfield);
    }

}
