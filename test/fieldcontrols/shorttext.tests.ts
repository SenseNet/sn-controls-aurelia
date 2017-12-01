import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { FieldSettings } from 'sn-client-js';
import { ShortText } from '../../src/fieldcontrols';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

@suite('ShortText component')
export class ShortTextTests extends FieldControlBaseTest<ShortText> {

    /**
     *
     */
    constructor() {
        super(ShortText, 'short-text');
        
    }
    
    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createFieldViewModel();
        expect(viewModel).to.be.instanceof(ShortText);
    }

    @test
    public async 'Can not be modified if is read only'() {
        const viewModel = await this.createFieldViewModel();       
        viewModel.settings = {
            ReadOnly: true
        } as FieldSettings.ShortTextFieldSetting;
        viewModel.content = this.mockRepo.HandleLoadedContent({Id: 12385, Path: 'root/path', Name: 'example'});
        const contentViewElement = document.querySelector('short-text input') as HTMLInputElement;
        expect(contentViewElement.disabled).to.be.eq(true);

    }

    @test
    public async 'Required rule is added if complusory'() {
        const viewModel = await this.createFieldViewModel();       
        viewModel.settings = {
            Compulsory: true
        } as FieldSettings.ShortTextFieldSetting;
        viewModel.content = this.mockRepo.HandleLoadedContent({Id: 12385, Path: 'root/path', Name: 'example'});

        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq('required');
    }
}