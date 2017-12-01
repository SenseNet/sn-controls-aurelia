/**
 * @module FieldControls
 * 
 */ /** */

import { autoinject, customElement, bindable } from 'aurelia-framework'
import { FieldBaseControl } from './FieldBaseControl';
import { FieldSettings } from 'sn-client-js';
import { LocaleService } from '../services';
import { MDCTextField } from '@material/textfield/dist/mdc.textfield';
import 'moment';
import * as moment from 'moment-timezone';


/**
 * Field control that represents a Date Picker. Formatting will be done based on the LocaleService
 * Usage:
 * 
 * ``` html
 * <date-only content.bind="content" settings.bind="myDateTimeFieldSettings"></date-only>
 * ```
 */
@autoinject
@customElement('date-only')
export class DateOnly extends FieldBaseControl<string, FieldSettings.DateTimeFieldSetting> {

    constructor(private localeService: LocaleService) {
        super();
    }

    datefield: HTMLElement;
    mdcDateField: MDCTextField;

    attached(){
        this.mdcDateField = new MDCTextField(this.datefield);
    }

    @bindable
    public dateValue: string;

    public dateValueChanged(newValue){
        this.value = newValue && moment(newValue).format('YYYY-MM-DDT00:00:00') + 'Z';
    }

    public valueChanged(newValue){
        this.dateValue = moment(this.value).format(this.localeService.DateFormat)
    }
}