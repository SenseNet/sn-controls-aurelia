/**
 * @module FieldControls
 * 
 */ /** */

import { FieldSettings } from 'sn-client-js';
import { customElement } from 'aurelia-framework';

import { FieldBaseControl } from './FieldBaseControl';

import { MDCTextField } from '@material/textfield/dist/mdc.textfield';


/**
 * Field control for passwords.
 * Usage:
 * 
 * ``` html
 * <password-field content.bind="content" settings.bind="myPasswordFieldSetting"></password-field>
 * ```
 */
@customElement('password-field')
export class Password extends FieldBaseControl<string, FieldSettings.PasswordFieldSetting> {
    textfield: HTMLElement;
    mdcTextField: MDCTextField;

    attached() {
        this.mdcTextField = new MDCTextField(this.textfield);
    }
}

