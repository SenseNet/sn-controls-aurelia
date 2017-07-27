/**
 * @module FieldControls
 * 
 */ /** */
 
import { FieldBaseControl } from './FieldBaseControl';
import { FieldSettings } from 'sn-client-js';
import { MdSelect } from 'aurelia-materialize-bridge'
import { customElement } from 'aurelia-framework';

/**
 * Field control that represents a Checkbox field. Available values will be populated from the FieldSettings.
 * Usage:
 * 
 * ``` html
 * <choice content.bind="content" settings.bind="myChoiceFieldSettings"></choice>
 * ```
 */
@customElement('checkbox')
export class Checkbox extends FieldBaseControl<Object, FieldSettings.ChoiceFieldSetting> {
    
    mdSelect: MdSelect;
}