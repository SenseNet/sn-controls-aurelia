import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { FieldSettings } from 'sn-client-js';
import { Checkbox } from '../../src/fieldcontrols';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

@suite('Checkbox component')
export class CheckboxFieldests extends FieldControlBaseTest<Checkbox> {

    constructor() {
        super(Checkbox, 'checkbox');
    }

    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createFieldViewModel();
        expect(viewModel).to.be.instanceof(Checkbox);
    }

    @test
    public async 'Can not be modified if is read only'() {
        const viewModel = await this.createFieldViewModel();
        viewModel.settings = {
            ReadOnly: true
        } as FieldSettings.FieldSetting;
        viewModel.content = this.mockRepo.HandleLoadedContent({Id: 12387, Path: 'asd', Name: ''});
        const contentViewElement = document.querySelector('checkbox input') as HTMLInputElement;
        expect(contentViewElement.disabled).to.be.eq(true);
    }

    @test
    public async 'Required rule is added if complusory'() {

        const viewModel = await this.createFieldViewModel();
        viewModel.content = this.mockRepo.HandleLoadedContent({Id: 123387, Path: 'asd', Name: ''});
        viewModel.settings = {
            Compulsory: true
        }  as FieldSettings.FieldSetting;
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq('required');
    }
}