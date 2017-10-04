/**
 * @module FieldControls
 * 
 */ /** */

import { FieldSettings } from 'sn-client-js';
import { customElement } from 'aurelia-framework';
import { FieldBaseControl } from './FieldBaseControl';
import { textfield } from 'material-components-web/dist/material-components-web'; 

/**
 * Field control for Content DisplayNames.
 * Usage:
 * 
 * ``` html
 * <display-name content.bind="content" settings.bind="myShortTextFieldSettings"></display-name>
 * ```
 */
@customElement('display-name')
export class DisplayName extends FieldBaseControl<string, FieldSettings.ShortTextFieldSetting> {
    textfield: HTMLElement;
    mdcTextField: textfield.MDCTextField;

    attached(){
        this.mdcTextField = new textfield.MDCTextfield(this.textfield);
    }

}

