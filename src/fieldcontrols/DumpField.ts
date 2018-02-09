/**
 * @module FieldControls
 *
 */ /** */

import { FieldSetting } from "@sensenet/default-content-types";
import { customElement } from "aurelia-framework";
import { FieldBaseControl } from "./FieldBaseControl";

/**
 * Fallback field for unimplemented field controls.
 * Usage:
 *
 * ``` html
 * <dump-field content.bind="content" settings.bind="myFieldSettings"></dump-field>
 * ```
 */
@customElement("dump-field")
export class DumpField extends FieldBaseControl<any, FieldSetting> {
}
