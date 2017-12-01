/**
 * @module FieldControls
 * 
 */ /** */

import { FieldSettings } from 'sn-client-js';
import { customElement } from 'aurelia-framework';
import { FieldBaseControl } from './FieldBaseControl';
import { MDCTextField } from '@material/textfield/dist/mdc.textfield';

/**
 * Field control for unformatted long text (textarea).
 * Usage:
 * 
 * ``` html
 * <long-text content.bind="content" settings.bind="myLongTextFieldSetting"></long-text>
 * ```
 */
@customElement('long-text')
export class LongText extends FieldBaseControl<string, FieldSettings.LongTextFieldSetting> {

    textfield: HTMLElement;
    mdcTextField: MDCTextField;

    attached() {
        this.mdcTextField = new MDCTextField(this.textfield);
    }
}

