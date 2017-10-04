/**
 * @module FieldControls
 * 
 */ /** */


import { bindable, autoinject } from 'aurelia-framework'
import { FieldBaseControl } from './FieldBaseControl';
import { FieldSettings } from 'sn-client-js';
import { LocaleService } from '../services';
import 'moment';
import * as moment from 'moment-timezone';
import { textfield } from 'material-components-web/dist/material-components-web';



/**
 * Field control that represents a Date and Time Picker. Formatting will be done based on the LocaleService. Local time will be displayed, but UTC will be bound to the field's Value
 * Usage:
 * 
 * ``` html
 * <date-time content.bind="content" settings.bind="myDateTimeFieldSettings"></date-time>
 * ```
 */
@autoinject
export class DateTime extends FieldBaseControl<string, FieldSettings.DateTimeFieldSetting> {

    constructor(public localeService: LocaleService) {
        super();
    }

    datefield: HTMLElement;
    mdcDateField: textfield.MDCTextField;


    @bindable
    parsedValue: string;

    parsedValueChanged(){
        this.value = moment.tz(this.parsedValue, this.localeService.Timezone).toISOString();
    }

    attached() {
        this.mdcDateField = new textfield.MDCTextfield(this.datefield);
    }

    activate(model){
        super.activate(model);
        this.parsedValue = moment.utc(this.value).tz(this.localeService.Timezone).format(this.localeService.DateTimeFormat);
    }
}