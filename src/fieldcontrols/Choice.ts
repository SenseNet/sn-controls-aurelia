/**
 * @module FieldControls
 * 
 */ /** */

import { FieldBaseControl } from './FieldBaseControl';
import { FieldSettings } from 'sn-client-js';
import { customElement, bindable } from 'aurelia-framework';
import { select } from 'material-components-web/dist/material-components-web';

/**
 * Field control that represents a Choice field. Available values will be populated from the FieldSettings.
 * Usage:
 * 
 * ``` html
 * <choice content.bind="content" settings.bind="myChoiceFieldSettings"></choice>
 * ```
 */
@customElement('choice')
export class Choice extends FieldBaseControl<string[], FieldSettings.ChoiceFieldSetting> {


    select: HTMLElement;
    mdcSelect: select.MDCSelect;

    @bindable
    public DefaultText: string;

    attached(){
        this.mdcSelect = new select.MDCSelect(this.select);
        this.mdcSelect.listen('MDCSelect:change', (event) => {
            this.value = [].map.call(event.detail.selectedOptions, o => o.id);
        });
    }

    activate(model){
        super.activate(model);
        const selectedOptions = this.settings && this.settings.Options && this.settings.Options && this.settings.Options.filter(o => this.value && this.value.indexOf(o.Value) > -1);
        const defaultOption = this.settings && this.settings.Options && this.settings.Options.find(o => o.Value === this.settings.DefaultValue);
        this.value = defaultOption && [defaultOption.Value] || [];
        this.DefaultText = selectedOptions && selectedOptions.map(o => o.Text).join() || defaultOption && defaultOption.Text || this.settings.DisplayName || '';
    }
}