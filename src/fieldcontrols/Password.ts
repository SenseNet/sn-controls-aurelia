import { FieldSettings, Content, Resources } from 'sn-client-js';
import { bindable, computedFrom, customElement } from 'aurelia-framework';

import { AureliaClientFieldConfig } from '../AureliaClientFieldConfig';
import { FieldBaseControl } from './FieldBaseControl';
import { ValidationRules, FluentRules } from 'aurelia-validation';

@customElement('password-field')
export class Password extends FieldBaseControl<string, FieldSettings.PasswordFieldSetting> {

    get rules(): any {
        const parentRules = super.rules || [];

        let thisRules = this.settings && ValidationRules
            .ensure('value')
                .minLength(this.settings.MinLength || 0)
                .maxLength(this.settings.MaxLength || Infinity)
                .matches(this.settings.Regex && new RegExp(this.settings.Regex) || new RegExp('')).rules;

        return [...(parentRules ? parentRules : []), ...(thisRules ? thisRules : [])];
    }

}

