/**
 * @module FieldControls
 *
 */ /** */

import { MDCTextField } from "@material/textfield/dist/mdc.textfield";
import { DateTimeFieldSetting } from "@sensenet/default-content-types";
import { autoinject, bindable, customElement } from "aurelia-framework";
import "moment";
import * as moment from "moment-timezone";
import { LocaleService } from "../services";
import { FieldBaseControl } from "./FieldBaseControl";

/**
 * Field control that represents a Date Picker. Formatting will be done based on the LocaleService
 * Usage:
 *
 * ``` html
 * <date-only content.bind="content" settings.bind="myDateTimeFieldSettings"></date-only>
 * ```
 */
@autoinject
@customElement("date-only")
export class DateOnly extends FieldBaseControl<string, DateTimeFieldSetting> {

    constructor(private localeService: LocaleService) {
        super();
    }

    public datefield!: HTMLElement;
    public mdcDateField: MDCTextField;

    public attached() {
        this.mdcDateField = new MDCTextField(this.datefield);
    }

    @bindable
    public dateValue!: string;

    public dateValueChanged(newValue: Date | string) {
        this.value = newValue && moment(newValue).format("YYYY-MM-DDT00:00:00") + "Z";
    }

    public valueChanged(newValue: Date | string) {
        this.dateValue = moment(this.value).format(this.localeService.dateFormat);
    }
}
