import { FieldBaseControl } from './FieldBaseControl';
import { FieldSettings } from 'sn-client-js';
import { MdSelect } from 'aurelia-materialize-bridge'
import { customElement } from 'aurelia-framework';

@customElement('choice')
export class Choice extends FieldBaseControl<Object, FieldSettings.ChoiceFieldSetting> {
    
    mdSelect: MdSelect;

    constructor() {
        super();
    }
}