import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { FieldSettings } from 'sn-client-js';
import { SettingsValidationCustomAttribute } from '../../src/attributes';
import 'jsdom';

@suite('SettingsValidation custom attribute')
export class SettingsValidationTests {

    private element: HTMLElement;
    private attribute: SettingsValidationCustomAttribute;
    before() {
        this.element = document.createElement('input'); //new HTMLElement();
        this.attribute = new SettingsValidationCustomAttribute(this.element);
    }

    @test
    public async 'Can be constructed'() {
        expect(this.attribute).to.be.instanceof(SettingsValidationCustomAttribute);
    }

    @test
    public async 'Setting can be bound'() {
        const s = new FieldSettings.FieldSetting({});
        this.attribute.settings = s;
        expect(this.attribute.settings).to.be.eq(s);
    }

    @test
    public async 'Sets required attribute on input element based on the complusory setting'() {

        this.attribute.settingsChanged(new FieldSettings.FieldSetting({
            compulsory: true
        }));
        expect(this.element.getAttribute('required')).to.be.eq('required');

        this.attribute.settingsChanged(new FieldSettings.FieldSetting({
            compulsory: false
        }));
        expect(this.element.getAttribute('required')).to.be.null;
    }

    @test
    public async 'Sets minlength attribute on input element based on the minLength setting'() {
        this.attribute.settingsChanged(new FieldSettings.TextFieldSetting({
            minLength: 10
        }));
        expect(this.element.getAttribute('minlength')).to.be.eq('10');

        this.attribute.settingsChanged(new FieldSettings.TextFieldSetting({
            minLength: undefined
        }));
        expect(this.element.getAttribute('minlength')).to.be.null;
    }

    @test
    public async 'Sets maxlength attribute on input element based on the maxLength setting'() {
        this.attribute.settingsChanged(new FieldSettings.TextFieldSetting({
            maxLength: 10
        }));
        expect(this.element.getAttribute('maxlength')).to.be.eq('10');

        this.attribute.settingsChanged(new FieldSettings.TextFieldSetting({
            maxLength: undefined
        }));
        expect(this.element.getAttribute('maxlength')).to.be.null;
    }

    @test
    public async 'Sets pattern attribute on input element based on the regex setting'() {
        this.attribute.settingsChanged(new FieldSettings.ShortTextFieldSetting ({
            regex: 'example'
        }));
        expect(this.element.getAttribute('pattern')).to.be.eq('example');

        this.attribute.settingsChanged(new FieldSettings.ShortTextFieldSetting ({
            regex: undefined
        }));
        expect(this.element.getAttribute('pattern')).to.be.null;
    }    
}