import { FieldSettings, Content, Resources } from 'sn-client-js';
import { bindable, computedFrom, customElement } from 'aurelia-framework';

import { AureliaClientFieldConfig } from '../AureliaClientFieldConfig';
import { FieldBaseControl } from './FieldBaseControl';
import { ValidationRules, FluentRules } from 'aurelia-validation';

@customElement('display-name')
export class DisplayName extends FieldBaseControl<string, FieldSettings.ShortTextFieldSetting> {

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

