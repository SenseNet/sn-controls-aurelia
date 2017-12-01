import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { FieldSettings } from 'sn-client-js';
import { Integer } from '../../src/fieldcontrols';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

@suite('IntegerField component')
export class IntegerFieldTests extends FieldControlBaseTest<Integer> {

    constructor() {
        super(Integer, 'integer-field');
    }

    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createFieldViewModel();
        expect(viewModel).to.be.instanceof(Integer);
    }

    @test
    public async 'Can not be modified if is read only'() {

        const viewModel = await this.createFieldViewModel();
        viewModel.settings = {
            ReadOnly: true
        } as FieldSettings.ChoiceFieldSetting;
        viewModel.content = this.mockRepo.HandleLoadedContent({Id: 1285, Path: 'root/path', Name: ''})
        const contentViewElement = document.querySelector('integer-field input') as HTMLInputElement;
        expect(contentViewElement.disabled).to.be.eq(true);

    }

    @test
    public async 'Required rule is added if complusory'() {
        const viewModel = await this.createFieldViewModel();
        viewModel.content = this.mockRepo.HandleLoadedContent({Id: 1285, Path: 'root/path', Name: ''})
        viewModel.settings = {
            Compulsory: true
        } as FieldSettings.ChoiceFieldSetting;

        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq('required');
    }
}