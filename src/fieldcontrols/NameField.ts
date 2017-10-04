/**
 * @module FieldControls
 * 
 */ /** */

import { FieldSettings } from 'sn-client-js';
import { autoinject, computedFrom } from 'aurelia-framework';
import { FieldBaseControl } from './FieldBaseControl';
import { customElement } from 'aurelia-templating';
import { textfield } from 'material-components-web/dist/material-components-web';


/**
 * Field control for Content name.
 * Usage:
 * 
 * ``` html
 * <name-field content.bind="content" settings.bind="myShortTextFieldSettings"></name-field>
 * ```
 */
@autoinject
@customElement('name-field')
export class NameField extends FieldBaseControl<string, FieldSettings.ShortTextFieldSetting> {

    textfield: HTMLElement;
    mdcTextField: textfield.MDCTextField;

    @computedFrom('content')
    get parentPath(): string{
        return this.content && (this.content.IsSaved ? this.content.ParentPath : this.content.Path) || '';
    }

    attached() {
        this.mdcTextField = new textfield.MDCTextfield(this.textfield);
    }


}

