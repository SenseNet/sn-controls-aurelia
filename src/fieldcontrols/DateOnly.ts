import { computedFrom, autoinject, customAttribute, customElement } from 'aurelia-framework'
import { FieldBaseControl } from './FieldBaseControl';
import { FieldSettings } from 'sn-client-js';
import { LocaleService } from '../services';
import 'moment';
import * as moment from 'moment-timezone';
import { ValidationRules } from 'aurelia-validation';

@autoinject
@customElement('date-only')
export class DateOnly extends FieldBaseControl<string, FieldSettings.DateTimeFieldSetting> {

    constructor(private localeService: LocaleService) {
        super();
    }

    get value(){
        return super.value;
    }

    set value(newValue){
        super.value = newValue && moment(newValue).format('YYYY-MM-DDT00:00:00') + 'Z';
    }

    @computedFrom('settings')
    get advancedOptions() {
        return {
            closeOnSelect: true,
            closeOnClear: true,
            selectYears: 50,
            showIcon: !this.readOnly,
            format: this.localeService.DateFormat,
        };
    };

}