import { bindable, autoinject } from 'aurelia-framework';
import { FieldSettings } from 'sn-client-js';

@autoinject
export class SettingsValidationCustomAttribute {
    
    @bindable({primaryProperty: true})
    settings: FieldSettings.FieldSetting;

    constructor(private element: Element) {

    }

    settingsChanged(newSetting: FieldSettings.FieldSetting){
        // Req'd
        newSetting.Compulsory ? this.element.setAttribute('required', 'required') : this.element.removeAttribute('required');

        //TextFields - MinLength
        (newSetting instanceof FieldSettings.TextFieldSetting && newSetting.MinLength) ? this.element.setAttribute('minlength', newSetting.MinLength.toString()) : this.element.removeAttribute('minlength');

        //TextFields - MaxLength
        (newSetting instanceof FieldSettings.TextFieldSetting && newSetting.MaxLength) ? this.element.setAttribute('maxlength', newSetting.MaxLength.toString()) : this.element.removeAttribute('maxlength');
       
        //ShortText - Regex/pattern
        (newSetting instanceof FieldSettings.ShortTextFieldSetting && newSetting.Regex) ? this.element.setAttribute('pattern', newSetting.Regex) : this.element.removeAttribute('pattern');

        //...
    }
}    