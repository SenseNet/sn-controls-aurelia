/**
 * @module Attributes
 * 
 */ /** */

import { bindable, autoinject } from 'aurelia-framework';
import { FieldSettings } from 'sn-client-js';

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
    settings: FieldSettings.FieldSetting;

    constructor(private element: Element) {

    }

    settingsChanged(newSetting: FieldSettings.FieldSetting){
        // Req'd
        newSetting.Compulsory ? this.element.setAttribute('required', 'required') : this.element.removeAttribute('required');

        //TextFields - MinLength
        if (FieldSettings.isFieldSettingOfType(newSetting, FieldSettings.TextFieldSetting) && newSetting.MinLength){
            this.element.setAttribute('minlength', newSetting.MinLength.toString())
        } else {
            this.element.removeAttribute('minlength')
        }

        //TextFields - MaxLength
        (FieldSettings.isFieldSettingOfType(newSetting, FieldSettings.TextFieldSetting) && newSetting.MaxLength) ? this.element.setAttribute('maxlength', newSetting.MaxLength.toString()) : this.element.removeAttribute('maxlength');
       
        //ShortText - Regex/pattern
        (FieldSettings.isFieldSettingOfType(newSetting, FieldSettings.ShortTextFieldSetting) && newSetting.Regex) ? this.element.setAttribute('pattern', newSetting.Regex) : this.element.removeAttribute('pattern');

        //...
    }
}    