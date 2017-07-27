/**
 * @module FieldControls
 * 
 */ /** */

import { FieldBaseControl } from './FieldBaseControl';
import { FieldSettings } from 'sn-client-js';
import { ValidationRules } from 'aurelia-validation';
import { customElement } from 'aurelia-framework';


/**
 * Field control for integer (whole number) fields.
 * Usage:
 * 
 * ``` html
 * <integer-field content.bind="content" settings.bind="myIntegerFieldSetting"></integer-field>
 * ```
 */
@customElement('integer-field')
export class Integer extends FieldBaseControl<number, FieldSettings.IntegerFieldSetting> {


    get rules(): any {
        const parentRules = super.rules;
        let thisRules = ValidationRules
            .ensure('value')
            .minLength(this.settings.MinValue || 0)
            .maxLength(this.settings.MaxValue || Infinity).rules || [];

        return [...parentRules, ...thisRules];
    }

}