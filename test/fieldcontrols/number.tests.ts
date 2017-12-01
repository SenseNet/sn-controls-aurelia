import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { FieldSettings } from 'sn-client-js';
import { Number } from '../../src/fieldcontrols';
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
        viewModel.settings = {
            ReadOnly: true
        } as FieldSettings.IntegerFieldSetting;
        viewModel.content = this.mockRepo.HandleLoadedContent({Id: 12487, Path: 'root/path', Name: 'C1'});
        const contentViewElement = document.querySelector('number-field input') as HTMLInputElement;
        expect(contentViewElement.disabled).to.be.eq(true);

    }

    @test
    public async 'Required rule is added if complusory'() {
        const viewModel = await this.createFieldViewModel();
        viewModel.settings = {
            Compulsory: true
        } as FieldSettings.IntegerFieldSetting;
        viewModel.content = this.mockRepo.HandleLoadedContent({Id: 12487, Path: 'root/path', Name: 'C1'});
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq('required');
    }
}