/**
 * @module FieldControls
 * 
 */ /** */

import { FieldSettings } from 'sn-client-js';
import { customElement } from 'aurelia-framework';
import { FieldBaseControl } from './FieldBaseControl';
import { ValidationRules } from 'aurelia-validation';


/**
 * Field control for unformatted long text (textarea).
 * Usage:
 * 
 * ``` html
 * <long-text content.bind="content" settings.bind="myLongTextFieldSetting"></long-text>
 * ```
 */
@customElement('long-text')
export class LongText extends FieldBaseControl<string, FieldSettings.LongTextFieldSetting> {

    get rules(): any {
        const parentRules = super.rules;

        let thisRules = this.settings && ValidationRules
            .ensure('value')
                .minLength(this.settings.MinLength || 0)
                .maxLength(this.settings.MaxLength || Infinity).rules || [];

        return [...parentRules, ...thisRules];
    }
}

