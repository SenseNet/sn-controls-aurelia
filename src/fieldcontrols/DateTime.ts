/**
 * @module FieldControls
 *
 */ /** */

import { MDCTextField } from "@material/textfield/dist/mdc.textfield";
import { DateTimeFieldSetting } from "@sensenet/default-content-types";
import { autoinject, bindable } from "aurelia-framework";
import "moment";
import * as moment from "moment-timezone";
import { LocaleService } from "../services";
import { FieldBaseControl } from "./FieldBaseControl";

/**
 * Field control that represents a Date and Time Picker. Formatting will be done based on the LocaleService. Local time will be displayed, but UTC will be bound to the field's Value
 * Usage:
 *
 * ``` html
 * <date-time content.bind="content" settings.bind="myDateTimeFieldSettings"></date-time>
 * ```
 */
@autoinject
export class DateTime extends FieldBaseControl<string, DateTimeFieldSetting> {

    constructor(public localeService: LocaleService) {
        super();
    }

    public datefield!: HTMLElement;
    public mdcDateField: MDCTextField;

    @bindable
    public parsedValue!: string;

    public parsedValueChanged() {
        this.value = moment.tz(this.parsedValue, this.localeService.timezone).toISOString();
    }

    public attached() {
        this.mdcDateField = new MDCTextField(this.datefield);
    }

    public activate(model: any) {
        super.activate(model);
        this.parsedValue = moment.utc(this.value).tz(this.localeService.timezone).format(this.localeService.dateTimeFormat);
    }
}
