import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { FieldSettings } from 'sn-client-js';
import { Choice } from '../../src/fieldcontrols';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

@suite('ChoiceField component')
export class ChoiceFieldests extends FieldControlBaseTest<Choice> {

    constructor() {
        super(Choice, 'choice');
    }

    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createFieldViewModel();
        expect(viewModel).to.be.instanceof(Choice);
    }

    @test
    public async 'Can not be modified if is read only'() {
        const viewModel = await this.createFieldViewModel();
        viewModel.settings = {
            ReadOnly: true
        } as FieldSettings.ChoiceFieldSetting;
        viewModel.content = this.mockRepo.HandleLoadedContent({Id: 12387, Path: 'asd', Name: ''});
        const contentViewElement = document.querySelector('choice input') as HTMLInputElement;
        expect(contentViewElement.disabled).to.be.eq(true);
    }

    @test
    public async 'Writes back value when changed'() {

        const viewModel = await this.createFieldViewModel();
        const content = this.mockRepo.HandleLoadedContent({Id: 1237, Path: 'asd', Name: ''});
        expect(viewModel.value).to.be.undefined;
        const settings = {
            Compulsory: true,
            DefaultValue: 'Value1',
            Options: [
                {
                    Enabled: true,
                    Value: 'Value1',
                    Text: 'Value1'
                },
                {
                    Enabled: true,
                    Value: 'Value2',
                    Text: 'Value2'
                }
                
            ]
        } as FieldSettings.ChoiceFieldSetting;
        viewModel.activate({ content, settings })

        viewModel.mdcSelect.emit('MDCSelect:change');
        expect(viewModel.value[0]).of.be.eq('Value1');
        
    }
}