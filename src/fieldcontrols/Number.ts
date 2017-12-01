/**
 * @module FieldControls
 * 
 */ /** */

import { FieldBaseControl } from './FieldBaseControl';
import { FieldSettings } from 'sn-client-js';
import { customElement } from 'aurelia-framework';
import { MDCTextField } from '@material/textfield/dist/mdc.textfield';

/**
 * Field control for number fields.
 * Usage:
 * 
 * ``` html
 * <number-field content.bind="content" settings.bind="myNumberFieldSetting"></number-field>
 * ```
 */
@customElement('number-field')
export class Number  extends FieldBaseControl<number, FieldSettings.NumberFieldSetting> {

    textfield: HTMLElement;
    mdcTextField: MDCTextField;

    attached(){
        this.mdcTextField = new MDCTextField(this.textfield);
    }
}