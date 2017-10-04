/**
 * @module FieldControls
 * 
 */ /** */

import { FieldBaseControl } from './FieldBaseControl';
import { FieldSettings } from 'sn-client-js';
import { slider } from 'material-components-web/dist/material-components-web';
import { bindable } from 'aurelia-framework';


/**
 * Field control for percentage fields.
 * Usage:
 * 
 * ``` html
 * <percentage content.bind="content" settings.bind="myIntegerFieldSetting"></percentage>
 * ```
 */
export class Percentage extends FieldBaseControl<number, FieldSettings.IntegerFieldSetting> {
    sliderElement: HTMLElement;
    mdcSlider: slider.MDCSlider;

    @bindable
    public value: number;

    attached() {
        this.mdcSlider = new slider.MDCSlider(this.sliderElement);
        // this.mdcSlider.value = this.value;
        this.mdcSlider.listen('MDCSlider:change', () => {
            if (this.value !== this.mdcSlider.value){
                this.value = this.mdcSlider.value;
            }
        });

        // Tempfix. Related issue: https://github.com/material-components/material-components-web/issues/1017
        setTimeout(() => {
            try {
                window.dispatchEvent(new Event('resize'));                
            } catch (error) {
                // jsdom will throw...
            }
        }, 100)
    }

    valueChanged(){
        if (this.value !== this.mdcSlider.value){
            this.mdcSlider.value = this.value;
            this.mdcSlider.emit('MDCSlider:change');
        }
        
    }
}