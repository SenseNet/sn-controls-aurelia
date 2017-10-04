/**
 * @module FieldControls
 * 
 */ /** */

import { FieldBaseControl } from './FieldBaseControl';
import { FieldSettings } from 'sn-client-js';
import { textfield } from 'material-components-web/dist/material-components-web';
import { customElement } from 'aurelia-framework';


/**
 * Field control for integer (whole number) fields.
 * Usage:
 * 
 * ``` html
 * <integer-field content.bind="content" settings.bind="myIntegerFieldSetting"></integer-field>
 * ```
 */
@customElement('integer-field')
export class Integer extends FieldBaseControl<number, FieldSettings.IntegerFieldSetting> {

    textfield: HTMLElement;
    mdcTextField: textfield.MDCTextField;

    attached(){
        this.mdcTextField = new textfield.MDCTextfield(this.textfield);
    }
}