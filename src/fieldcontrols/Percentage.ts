/**
 * @module FieldControls
 *
 */ /** */

import { IntegerFieldSetting } from "@sensenet/default-content-types";
import { bindable } from "aurelia-framework";
import { slider } from "material-components-web/dist/material-components-web";
import { FieldBaseControl } from "./FieldBaseControl";

/**
 * Field control for percentage fields.
 * Usage:
 *
 * ``` html
 * <percentage content.bind="content" settings.bind="myIntegerFieldSetting"></percentage>
 * ```
 */
export class Percentage extends FieldBaseControl<number, IntegerFieldSetting> {
    public sliderElement!: HTMLElement;
    public mdcSlider: slider.MDCSlider;

    @bindable
    public value!: number;

    public attached() {
        this.mdcSlider = new slider.MDCSlider(this.sliderElement);
        // this.mdcSlider.value = this.value;
        this.mdcSlider.listen("MDCSlider:change", () => {
            if (this.value !== this.mdcSlider.value) {
                this.value = this.mdcSlider.value;
            }
        });

        // Tempfix. Related issue: https://github.com/material-components/material-components-web/issues/1017
        setTimeout(() => {
            try {
                window.dispatchEvent(new Event("resize"));
            } catch (error) {
                // jsdom will throw...
            }
        }, 100);
    }

    public valueChanged() {
        if (this.value !== this.mdcSlider.value) {
            this.mdcSlider.value = this.value;
            this.mdcSlider.emit("MDCSlider:change");
        }

    }
}
