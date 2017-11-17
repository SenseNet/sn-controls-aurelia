import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ContentTypes, FieldSettings } from 'sn-client-js';
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
        viewModel.settings = new FieldSettings.FieldSetting({
            readOnly: true
        });
        viewModel.content = new ContentTypes.Task({} as any, this.mockRepo);
        const contentViewElement = document.querySelector('checkbox input') as HTMLInputElement;
        expect(contentViewElement.disabled).to.be.eq(true);
    }

    @test
    public async 'Required rule is added if complusory'() {

        const viewModel = await this.createFieldViewModel();
        viewModel.content = new ContentTypes.Task({} as any, this.mockRepo); ;
        viewModel.settings = new FieldSettings.ChoiceFieldSetting({
            compulsory: true
        });
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq('required');
    }
}