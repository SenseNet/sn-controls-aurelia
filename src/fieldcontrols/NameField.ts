/**
 * @module FieldControls
 * 
 */ /** */

import { FieldSettings } from 'sn-client-js';
import { autoinject } from 'aurelia-framework';
import { FieldBaseControl } from './FieldBaseControl';
import { ValidationRules } from 'aurelia-validation';
import { customElement } from 'aurelia-templating';


/**
 * Field control for Content name.
 * Usage:
 * 
 * ``` html
 * <name-field content.bind="content" settings.bind="myShortTextFieldSettings"></name-field>
 * ```
 */
@autoinject
@customElement('name-field')
export class NameField extends FieldBaseControl<string, FieldSettings.ShortTextFieldSetting> {

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

