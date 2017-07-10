import { FieldBaseControl } from './FieldBaseControl';
import { FieldSettings } from 'sn-client-js';
import { autoinject, customElement } from 'aurelia-framework';
import { ValidationController, ValidationRules } from 'aurelia-validation';

@customElement('number-field')
export class Number  extends FieldBaseControl<number, FieldSettings.NumberFieldSetting> {
    get rules(): any {
        const parentRules = super.rules || [];
        let thisRules = ValidationRules
            .ensure('value')
                .minLength(this.settings.MinValue || 0)
                .maxLength(this.settings.MaxValue || Infinity);

        return [...(parentRules ? parentRules : []), ...(thisRules.rules ? thisRules.rules : [])];
    }
}