import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ContentTypes, FieldSettings } from 'sn-client-js';
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
        viewModel.settings = new FieldSettings.ChoiceFieldSetting({
            readOnly: true
        });
        viewModel.content = new ContentTypes.Task({} as any, this.mockRepo);
        const contentViewElement = document.querySelector('choice input') as HTMLInputElement;
        expect(contentViewElement.disabled).to.be.eq(true);
    }

    @test
    public async 'Writes back value when changed'() {

        const viewModel = await this.createFieldViewModel();
        const content = new ContentTypes.Task({} as any, this.mockRepo); ;
        expect(viewModel.value).to.be.undefined;
        const settings = new FieldSettings.ChoiceFieldSetting({
            compulsory: true,
            defaultValue: 'Value1',
            options: [
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
        });
        viewModel.activate({ content, settings })

        viewModel.mdcSelect.emit('MDCSelect:change');
        expect(viewModel.value[0]).of.be.eq('Value1');
        
    }
}