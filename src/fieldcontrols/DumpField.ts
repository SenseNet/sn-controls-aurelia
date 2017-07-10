import { Content, FieldSettings } from 'sn-client-js';
import { FieldBaseControl } from './FieldBaseControl';
import { autoinject, customElement } from 'aurelia-framework';

@customElement('dump-field')
export class DumpField extends FieldBaseControl<any, FieldSettings.FieldSetting>{
}