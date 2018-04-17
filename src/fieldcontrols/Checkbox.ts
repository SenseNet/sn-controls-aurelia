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
 * <checkbox content.bind="content" settings.bind="myChoiceFieldSettings"></checkbox>
 * ```
 */
@customElement("checkbox")
export class Checkbox extends FieldBaseControl<object, ChoiceFieldSetting> {
}
