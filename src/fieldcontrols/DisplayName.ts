/**
 * @module FieldControls
 * 
 */ /** */

import { FieldSettings } from 'sn-client-js';
import { customElement } from 'aurelia-framework';
import { FieldBaseControl } from './FieldBaseControl';
import { MDCTextField } from '@material/textfield/dist/mdc.textfield'; 

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
    mdcTextField: MDCTextField;

    attached(){
        this.mdcTextField = new MDCTextField(this.textfield);
    }

}

