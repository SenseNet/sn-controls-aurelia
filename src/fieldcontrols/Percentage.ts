/**
 * @module FieldControls
 * 
 */ /** */

import { FieldBaseControl } from './FieldBaseControl';
import { FieldSettings } from 'sn-client-js';

/**
 * Field control for percentage fields.
 * Usage:
 * 
 * ``` html
 * <percentage content.bind="content" settings.bind="myIntegerFieldSetting"></percentage>
 * ```
 */
export class Percentage  extends FieldBaseControl<number, FieldSettings.IntegerFieldSetting> {

}