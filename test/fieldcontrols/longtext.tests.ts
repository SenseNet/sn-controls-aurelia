import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { FieldSettings } from 'sn-client-js';
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
        viewModel.content = this.mockRepo.HandleLoadedContent({Id: 1285, Path: 'root/path', Name: ''});
        viewModel.settings = {
            ReadOnly: true
        } as FieldSettings.ChoiceFieldSetting;

        const contentViewElement = document.querySelector('long-text') as any;
        expect(contentViewElement.au.controller.viewModel.readOnly).to.be.eq(true);

    }

    @test
    public async 'Required rule is added if complusory'() {
        const viewModel = await this.createFieldViewModel();
        viewModel.content = this.mockRepo.HandleLoadedContent({Id: 1285, Path: 'root/path', Name: ''});
        viewModel.settings = {
            Compulsory: true
        } as FieldSettings.ChoiceFieldSetting;
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq('required');
    }
}