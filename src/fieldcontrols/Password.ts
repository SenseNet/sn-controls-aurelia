/**
 * @module FieldControls
 * 
 */ /** */

import { FieldSettings } from 'sn-client-js';
import { customElement } from 'aurelia-framework';

import { FieldBaseControl } from './FieldBaseControl';
import { ValidationRules } from 'aurelia-validation';

/**
 * Field control for passwords.
 * Usage:
 * 
 * ``` html
 * <password-field content.bind="content" settings.bind="myPasswordFieldSetting"></password-field>
 * ```
 */
@customElement('password-field')
export class Password extends FieldBaseControl<string, FieldSettings.PasswordFieldSetting> {

    get rules(): any {
        const parentRules = super.rules;

        let thisRules = this.settings && ValidationRules
            .ensure('value')
                .minLength(this.settings.MinLength || 0)
                .maxLength(this.settings.MaxLength || Infinity)
                .matches(this.settings.Regex && new RegExp(this.settings.Regex) || new RegExp('')).rules || [];

        return [...parentRules, ...thisRules];
    }

}

