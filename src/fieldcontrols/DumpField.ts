/**
 * @module FieldControls
 * 
 */ /** */

import { FieldSettings } from 'sn-client-js';
import { FieldBaseControl } from './FieldBaseControl';
import { customElement } from 'aurelia-framework';

/**
 * Fallback field for unimplemented field controls.
 * Usage:
 * 
 * ``` html
 * <dump-field content.bind="content" settings.bind="myFieldSettings"></dump-field>
 * ```
 */
@customElement('dump-field')
export class DumpField extends FieldBaseControl<any, FieldSettings.FieldSetting>{
}