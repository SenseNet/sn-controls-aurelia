import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ContentTypes, FieldSettings } from 'sn-client-js';
import { Password } from '../../src/fieldcontrols';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

@suite('PasswordField component')
export class PasswordTests extends FieldControlBaseTest<Password> {

    /**
     *
     */
    constructor() {
        super(Password, 'password-field');
        
    }

    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createFieldViewModel();
        expect(viewModel).to.be.instanceof(Password);
    }

    @test
    public async 'Can not be modified if is read only'() {
        const viewModel = await this.createFieldViewModel();
        viewModel.settings = new FieldSettings.ChoiceFieldSetting({
            readOnly: true
        });
        viewModel.content = new ContentTypes.Task({} as any, this.mockRepo);
        const contentViewElement = document.querySelector('password-field input') as HTMLInputElement;
        expect(contentViewElement.disabled).to.be.eq(true);

    }

    @test
    public async 'Required rule is added if complusory'() {
        const viewModel = await this.createFieldViewModel();
        viewModel.settings = new FieldSettings.ChoiceFieldSetting({
            compulsory: true
        });
        viewModel.content = new ContentTypes.Task({} as any, this.mockRepo);
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq('required');
    }
}