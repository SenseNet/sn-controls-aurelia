import { computedFrom, bindable, autoinject } from 'aurelia-framework'
import { FieldBaseControl } from './FieldBaseControl';
import { FieldSettings, Content, ActionName } from 'sn-client-js';
import { LocaleService } from '../services';
import 'moment';
import * as moment from 'moment-timezone';
import { ValidationController } from 'aurelia-validation';

@autoinject
export class DateTime extends FieldBaseControl<string, FieldSettings.DateTimeFieldSetting> {

    constructor(public localeService: LocaleService) {
        super();
    }

    @bindable
    valueDate: string;

    @bindable
    valueTime: string;

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

    recalculateValue() {

        if (!this.valueDate || !this.valueTime){
            return;
        }

        // We need this h@ck because 'pickadate' and 'momentjs' has different date and time formatting options
        const dateFormatMoment = this.localeService.DateFormat.toUpperCase();
        const fullFormat = `${dateFormatMoment}T${this.localeService.TimeFormat}`;
        const momentValue = moment.tz(`${this.valueDate}T${this.valueTime}`, fullFormat, this.localeService.Timezone);
        this.value = momentValue.tz('UTC').toISOString();
    }

    valueDateChanged() {
        this.recalculateValue();
    };
    valueTimeChanged() {
        this.recalculateValue();
    };
    valueChanged() {
        this.fillDateTimeValues();
    }

    fillDateTimeValues() {
        if (!this.value) {
            // Prevent filling with current DateTime values
            return;
        }

        const momentValue = moment.utc(this.value).tz(this.localeService.Timezone);

        // We need this h@ck because 'pickadate' and 'momentjs' has different date and time formatting options
        const dateFormatMoment = this.localeService.DateFormat.toUpperCase();

        this.valueDate = momentValue.format(dateFormatMoment);
        this.valueTime = momentValue.format(this.localeService.TimeFormat);
    }

    activate(model: { settings: FieldSettings.DateTimeFieldSetting, content: Content, controller: ValidationController, actionName: ActionName }) {
        super.activate(model);
        this.fillDateTimeValues();
    }

}