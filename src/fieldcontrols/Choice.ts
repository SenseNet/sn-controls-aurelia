/**
 * @module FieldControls
 *
 */ /** */

import { ChoiceFieldSetting } from "@sensenet/default-content-types";
import { bindable, customElement } from "aurelia-framework";
import { select } from "material-components-web/dist/material-components-web";
import { FieldBaseControl } from "./FieldBaseControl";

/**
 * Field control that represents a Choice field. Available values will be populated from the FieldSettings.
 * Usage:
 *
 * ``` html
 * <choice content.bind="content" settings.bind="myChoiceFieldSettings"></choice>
 * ```
 */
@customElement("choice")
export class Choice extends FieldBaseControl<string[], ChoiceFieldSetting> {

    public select!: HTMLElement;
    public mdcSelect: select.MDCSelect;

    @bindable
    public defaultText!: string;

    public attached() {
        this.mdcSelect = new select.MDCSelect(this.select);
        this.mdcSelect.listen("MDCSelect:change", (event) => {
            // this.value = [].map.call(event.detail.selectedOptions, (o) => o.id);
        });
    }

    public activate(model: any) {
        super.activate(model);
        const selectedOptions = this.settings && this.settings.Options && this.settings.Options && this.settings.Options.filter((o) => this.value && this.value.indexOf(o.Value) > -1);
        const defaultOption = this.settings && this.settings.Options && this.settings.Options.find((o) => o.Value === this.settings.DefaultValue);
        this.value = defaultOption && [defaultOption.Value] || [];
        this.defaultText = selectedOptions && selectedOptions.map((o) => o.Text).join() || defaultOption && defaultOption.Text || this.settings.DisplayName || "";
    }
}
