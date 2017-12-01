import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';
import { FieldSettings } from 'sn-client-js';
import { DateOnly } from '../../src/fieldcontrols';

@suite('DateField component')
export class DateFieldTests extends FieldControlBaseTest<DateOnly> {
    
    constructor() {
        super(DateOnly, 'date-only');
    }

    @test
    public async 'Can be constructed'() {     
        const viewModel = await this.createFieldViewModel();
        expect(viewModel).to.be.instanceof(DateOnly);
    }

    @test
    public async 'Can not be modified if is read only'() {

        const viewModel = await this.createFieldViewModel();
        viewModel.settings = {
            ReadOnly: true
        } as FieldSettings.DateTimeFieldSetting;

        const contentViewElement = document.querySelector('date-only input') as HTMLInputElement;        
        expect(contentViewElement.disabled).to.be.eq(true);

    }

    @test
    public async 'Required rule is added if complusory'() {
        const viewModel = await this.createFieldViewModel();
        viewModel.settings = {
            Compulsory: true
        } as FieldSettings.DateTimeFieldSetting;
        viewModel.content = this.mockRepo.HandleLoadedContent({Id: 12387, Path: 'asd', Name: ''});
        viewModel.actionName = 'new';

        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq('required');
    }

    @test
    public async 'Setting Value should update super\'s Value'(){
        const viewModel = await this.createFieldViewModel();
        viewModel.settings = {
            Compulsory: true,
            DefaultValue: '1985-09-25T00:00:00Z'
        } as FieldSettings.DateTimeFieldSetting;
        viewModel.content = this.mockRepo.HandleLoadedContent({Id: 1387, Path: 'asd', Name: ''});
        viewModel.dateValue = '2017-01-01T11:11:11Z';
        viewModel.dateValueChanged(viewModel.dateValue);
        expect(viewModel.value).to.be.eq('2017-01-01T00:00:00Z');
    }

    @test
    public async 'Setting Content Value should update component\'s value'(){
        const viewModel = await this.createFieldViewModel();
        viewModel.settings = {
            Compulsory: true,
            DefaultValue: '1985-09-25T00:00:00Z'
        } as FieldSettings.DateTimeFieldSetting;
        viewModel.content = this.mockRepo.HandleLoadedContent({Id: 1237, Path: 'asd', Name: ''});
        viewModel.value = '2017-01-01T11:11:11Z';
        viewModel.valueChanged(viewModel.value);
        expect(viewModel.dateValue).to.be.eq('2017-01-01');
    }    
}