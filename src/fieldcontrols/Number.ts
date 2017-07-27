/**
 * @module FieldControls
 * 
 */ /** */

import { FieldBaseControl } from './FieldBaseControl';
import { FieldSettings } from 'sn-client-js';
import { customElement } from 'aurelia-framework';
import { ValidationRules } from 'aurelia-validation';

/**
 * Field control for number fields.
 * Usage:
 * 
 * ``` html
 * <number-field content.bind="content" settings.bind="myNumberFieldSetting"></number-field>
 * ```
 */
@customElement('number-field')
export class Number  extends FieldBaseControl<number, FieldSettings.NumberFieldSetting> {
    get rules(): any {
        const parentRules = super.rules;
        let thisRules = ValidationRules
            .ensure('value')
                .minLength(this.settings.MinValue || 0)
                .maxLength(this.settings.MaxValue || Infinity).rules || [];

        return [...parentRules, ...thisRules];
    }
}