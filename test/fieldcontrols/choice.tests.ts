import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { bootstrap } from 'aurelia-bootstrapper';
import { ComponentTestBase } from '../component-test.base';
import { ContentView } from '../../src/viewcontrols';
import { ContentTypes, ActionName, FieldSettings } from 'sn-client-js';
import { Choice } from '../../src/fieldcontrols';
import { ValidationController, ValidateBindingBehavior } from 'aurelia-validation';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

@suite('ChoiceField component')
export class ChoiceFieldests extends FieldControlBaseTest<Choice> {

    constructor() {
        super(Choice, 'choice');
    }

    private readonly componentView: string = '<generic-view><choice content.bind="content" action-name.bind="actionName" controller.bind="controller"></choice></generic-view>';

    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createFieldViewModel();
        expect(viewModel).to.be.instanceof(Choice);
    }

    @test
    public async 'Can not be modified if is read only'() {
        const settings = new FieldSettings.ChoiceFieldSetting({
            readOnly: true
        });
        const content = new ContentTypes.Task({} as any, this.mockRepo);

        const viewModel = await this.createFieldViewModel();
        viewModel.settings = settings;

        const contentViewElement = document.querySelector('choice input') as HTMLInputElement;

        expect(contentViewElement.disabled).to.be.eq(true);

    }

    @test
    public async 'Required rule is added if complusory'() {
        const settings = new FieldSettings.ChoiceFieldSetting({
            compulsory: true
        });
        const content = new ContentTypes.Task({} as any, this.mockRepo);

        const component = await this.createComponentAsync(this.componentView,
            { actionName: 'new', content: content, settings: settings });
        const contentViewElement = document.querySelector('choice') as any;
        const viewModel = contentViewElement.au.choice.viewModel as Choice;
        viewModel.activate({
            settings: settings,
            content: content,
            controller: null as any,
            actionName: 'new'
        })
        const rules = contentViewElement.au.controller.viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq('required');
    }
}