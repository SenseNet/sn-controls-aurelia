/**
 * @module FieldControls
 *
 */ /** */

import { ChoiceFieldSetting } from "@sensenet/default-content-types";
import { customElement } from "aurelia-framework";
import { FieldBaseControl } from "./FieldBaseControl";

/**
 * Field control that represents a Checkbox field. Available values will be populated from the FieldSettings.
 * Usage:
 *
 * ``` html
 * <choice content.bind="content" settings.bind="myChoiceFieldSettings"></choice>
 * ```
 */
@customElement("checkbox")
export class Checkbox extends FieldBaseControl<object, ChoiceFieldSetting> {

}
