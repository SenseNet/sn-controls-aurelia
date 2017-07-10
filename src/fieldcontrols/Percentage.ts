import { AureliaBaseControl } from '../AureliaBaseControl';
import { FieldBaseControl } from './FieldBaseControl';
import { Content } from 'sn-client-js';
import { AureliaClientFieldConfig } from '../AureliaClientFieldConfig';
import { FieldSettings } from 'sn-client-js';
import { autoinject } from 'aurelia-framework';
import { ValidationController } from 'aurelia-validation';

export class Percentage  extends FieldBaseControl<number, FieldSettings.IntegerFieldSetting> {

}