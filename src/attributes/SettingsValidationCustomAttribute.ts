/**
 * @module Attributes
 *
 */ /** */

import { FieldSetting, isFieldSettingOfType, ShortTextFieldSetting, TextFieldSetting } from "@sensenet/default-content-types";
import { autoinject, bindable } from "aurelia-framework";

/**
 * Custom attribute that can be added to an Input field and can be used to validate its value based on a provided sensenet FieldSetting.
 * Usage example:
 * ```html
 * <input type="text" value.bind="value" settings-validation.bind="settings">
 * ```
 * The following attributes will be added when a settings object is bound:
 *
 * required, minlength, maxlength, pattern
 */
@autoinject
export class SettingsValidationCustomAttribute {

    @bindable({primaryProperty: true})
    public settings!: FieldSetting;

    constructor(private element: Element) {

    }

    public settingsChanged(newSetting: FieldSetting) {
        // Req'd
        newSetting.Compulsory ? this.element.setAttribute("required", "required") : this.element.removeAttribute("required");

        // TextFields - MinLength
        if (isFieldSettingOfType(newSetting, TextFieldSetting) && newSetting.MinLength) {
            this.element.setAttribute("minlength", newSetting.MinLength.toString());
        } else {
            this.element.removeAttribute("minlength");
        }

        // TextFields - MaxLength
        (isFieldSettingOfType(newSetting, TextFieldSetting) && newSetting.MaxLength) ? this.element.setAttribute("maxlength", newSetting.MaxLength.toString()) : this.element.removeAttribute("maxlength");

        // ShortText - Regex/pattern
        (isFieldSettingOfType(newSetting, ShortTextFieldSetting) && newSetting.Regex) ? this.element.setAttribute("pattern", newSetting.Regex) : this.element.removeAttribute("pattern");

        // ...
    }
}
