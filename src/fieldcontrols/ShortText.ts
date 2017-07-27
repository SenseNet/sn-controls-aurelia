/**
 * @module FieldControls
 * 
 */ /** */

import { FieldSettings } from 'sn-client-js';
import { customElement } from 'aurelia-framework';

import { FieldBaseControl } from './FieldBaseControl';
import { ValidationRules } from 'aurelia-validation';

/**
 * Field control for general Short Text fields.
 * Usage:
 * 
 * ``` html
 * <short-text content.bind="content" settings.bind="myShortTextFieldSettings"></short-text>
 * ```
 */
@customElement('short-text')
export class ShortText extends FieldBaseControl<string, FieldSettings.ShortTextFieldSetting> {

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

