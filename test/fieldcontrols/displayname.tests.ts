import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { FieldSettings } from 'sn-client-js';
import { DisplayName } from '../../src/fieldcontrols';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

@suite('DisplayName component')
export class DisplayNameTests extends FieldControlBaseTest<DisplayName> {

    constructor() {
        super(DisplayName, 'display-name');
    }

    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createFieldViewModel(); 
        expect(viewModel).to.be.instanceof(DisplayName);
    }

    @test
    public async 'Can not be modified if is read only'() {
        const viewModel = await this.createFieldViewModel();
        viewModel.settings = {
            ReadOnly: true
        } as FieldSettings.ShortTextFieldSetting;
        expect(viewModel.readOnly).to.be.eq(true);
    }

    @test
    public async 'Required rule is added if complusory'() {
        const viewModel = await this.createFieldViewModel(); //(document.querySelector('display-name') as any).au.controller.viewModel as DisplayName;
        viewModel.settings = {
            Compulsory: true
        } as FieldSettings.ShortTextFieldSetting;
        viewModel.content = this.mockRepo.HandleLoadedContent({Id: 1285, Path: 'root/path', Name: ''})
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq('required');
    }
}