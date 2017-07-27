/**
 * @module FieldControls
 * 
 */ /** */

import { FieldSettings } from 'sn-client-js';
import { customElement } from 'aurelia-framework';
import { FieldBaseControl } from './FieldBaseControl';
import { ValidationRules } from 'aurelia-validation';

/**
 * Field control for Content DisplayNames.
 * Usage:
 * 
 * ``` html
 * <display-name content.bind="content" settings.bind="myShortTextFieldSettings"></display-name>
 * ```
 */
@customElement('display-name')
export class DisplayName extends FieldBaseControl<string, FieldSettings.ShortTextFieldSetting> {

    get rules(): any {
        const parentRules = super.rules;

        let thisRules = this.settings && ValidationRules
            .ensure('value')
                .minLength(this.settings.MinLength || 0)
                .maxLength(this.settings.MaxLength || Infinity)
                .matches(this.settings.Regex && new RegExp(this.settings.Regex) || new RegExp('')).rules || [];

        return [...parentRules , ...thisRules];
    }

}

