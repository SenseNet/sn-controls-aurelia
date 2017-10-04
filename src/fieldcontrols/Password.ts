/**
 * @module FieldControls
 * 
 */ /** */

import { FieldSettings } from 'sn-client-js';
import { customElement } from 'aurelia-framework';

import { FieldBaseControl } from './FieldBaseControl';

import { textfield } from 'material-components-web/dist/material-components-web';


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
    mdcTextField: textfield.MDCTextField;

    attached() {
        this.mdcTextField = new textfield.MDCTextfield(this.textfield);
    }
}

