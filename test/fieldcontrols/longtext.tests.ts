import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ContentTypes, FieldSettings } from 'sn-client-js';
import { LongText } from '../../src/fieldcontrols';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

@suite('LongText component')
export class LongTextTests extends FieldControlBaseTest<LongText> {
    constructor() {
        super(LongText, 'long-text');
        
    }


    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createFieldViewModel();
        expect(viewModel).to.be.instanceof(LongText);
    }

    @test
    public async 'Can not be modified if is read only'() {
        const viewModel = await this.createFieldViewModel();
        viewModel.content = new ContentTypes.Task({} as any, this.mockRepo);
        viewModel.settings = new FieldSettings.ChoiceFieldSetting({
            readOnly: true
        });

        const contentViewElement = document.querySelector('long-text') as any;
        expect(contentViewElement.au.controller.viewModel.readOnly).to.be.eq(true);

    }

    @test
    public async 'Required rule is added if complusory'() {
        const viewModel = await this.createFieldViewModel();
        viewModel.content = new ContentTypes.Task({} as any, this.mockRepo);
        viewModel.settings = new FieldSettings.ChoiceFieldSetting({
            compulsory: true
        });
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq('required');
    }
}