import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { bootstrap } from 'aurelia-bootstrapper';
import { ComponentTestBase } from '../component-test.base';
import { ContentView } from '../../src/viewcontrols';
import { ContentTypes, ActionName, FieldSettings, Retrier } from 'sn-client-js';
import { DisplayName } from '../../src/fieldcontrols';
import { ValidationController, ValidateBindingBehavior } from 'aurelia-validation';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

@suite('DisplayName component')
export class DisplayNameTests extends FieldControlBaseTest<DisplayName> {

    constructor() {
        super(DisplayName, 'display-name');
    }

    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createFieldViewModel(); 
        expect(viewModel).to.be.instanceof(DisplayName);
    }

    @test
    public async 'Can not be modified if is read only'() {
        const viewModel = await this.createFieldViewModel();
        viewModel.settings = new FieldSettings.ShortTextFieldSetting({
            readOnly: true
        });
        expect(viewModel.readOnly).to.be.eq(true);
    }

    @test
    public async 'Required rule is added if complusory'() {
        const viewModel = await this.createFieldViewModel(); //(document.querySelector('display-name') as any).au.controller.viewModel as DisplayName;
        viewModel.settings = new FieldSettings.ChoiceFieldSetting({
            compulsory: true
        });
        viewModel.content = new ContentTypes.Task({} as any, this.mockRepo);
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq('required');
    }
}