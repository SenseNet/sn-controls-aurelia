/**
 * @module FieldControls
 * 
 */ /** */

import { FieldSettings } from 'sn-client-js';
import { customElement } from 'aurelia-framework';
import { FieldBaseControl } from './FieldBaseControl';
import { textfield } from 'material-components-web/dist/material-components-web';

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
    mdcTextField: textfield.MDCTextField;

    attached() {
        this.mdcTextField = new textfield.MDCTextfield(this.textfield);
    }
}

