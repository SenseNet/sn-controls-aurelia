import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { bootstrap } from 'aurelia-bootstrapper';
import { ComponentTestBase } from '../component-test.base';
import { ContentView } from '../../src/viewcontrols';
import { ContentTypes, ActionName, FieldSettings } from 'sn-client-js';
import { Number } from '../../src/fieldcontrols';
import { ValidationController, ValidateBindingBehavior } from 'aurelia-validation';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

@suite('NumberField component')
export class NumberFieldTests extends FieldControlBaseTest<Number> {

    constructor() {
        super(Number, 'number-field');
    }

    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createFieldViewModel();
        expect(viewModel).to.be.instanceof(Number);
    }

    @test
    public async 'Can not be modified if is read only'() {
        const viewModel = await this.createFieldViewModel();
        viewModel.settings = new FieldSettings.ChoiceFieldSetting({
            readOnly: true
        });
        viewModel.content = new ContentTypes.Task({} as any, this.mockRepo);
        const contentViewElement = document.querySelector('number-field input') as HTMLInputElement;
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