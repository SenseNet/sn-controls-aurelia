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
        const s =  {} as FieldSettings.FieldSetting;
        this.attribute.settings = s;
        expect(this.attribute.settings).to.be.eq(s);
    }

    @test
    public async 'Sets required attribute on input element based on the complusory setting'() {

        this.attribute.settingsChanged({
            Compulsory: true
        } as FieldSettings.FieldSetting);
        expect(this.element.getAttribute('required')).to.be.eq('required');

        this.attribute.settingsChanged({
            Compulsory: false
        } as FieldSettings.FieldSetting);
        expect(this.element.getAttribute('required')).to.be.null;
    }

    @test
    public async 'Sets minlength attribute on input element based on the minLength setting'() {
        this.attribute.settingsChanged({
            MinLength: 10,
            Type: 'TextFieldSetting'
        } as FieldSettings.TextFieldSetting);
        expect(this.element.getAttribute('minlength')).to.be.eq('10');

        this.attribute.settingsChanged({
            MinLength: undefined
        } as FieldSettings.TextFieldSetting);
        expect(this.element.getAttribute('minlength')).to.be.null;
    }

    @test
    public async 'Sets maxlength attribute on input element based on the maxLength setting'() {
        this.attribute.settingsChanged({
            MaxLength: 10,
            Type: 'TextFieldSetting'
        } as FieldSettings.TextFieldSetting);
        expect(this.element.getAttribute('maxlength')).to.be.eq('10');

        this.attribute.settingsChanged({
            MaxLength: undefined
        } as FieldSettings.TextFieldSetting);
        expect(this.element.getAttribute('maxlength')).to.be.null;
    }

    @test
    public async 'Sets pattern attribute on input element based on the regex setting'() {
        this.attribute.settingsChanged({
            Name: 'Example',
            Type: 'ShortTextFieldSetting',
            Regex: 'example'
        } as FieldSettings.ShortTextFieldSetting);
        expect(this.element.getAttribute('pattern')).to.be.eq('example');

        this.attribute.settingsChanged({
            Name: 'Example',
            Type: 'ShortTextFieldSetting'
        } as FieldSettings.ShortTextFieldSetting);
        expect(this.element.getAttribute('pattern')).to.be.null;
    }    
}