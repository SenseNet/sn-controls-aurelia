import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ContentTypes, FieldSettings } from 'sn-client-js';
import { DateTime } from '../../src/fieldcontrols';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

@suite('DateTime field component')
export class DateTimeTests extends FieldControlBaseTest<DateTime> {
    
    constructor() {
        super(DateTime, 'date-time');
    }


    @test
    public async 'Can be constructed'() {     
        const viewModel = await this.createFieldViewModel();
        expect(viewModel).to.be.instanceof(DateTime);
    }

    @test
    public async 'Can not be modified if is read only'() {

        const viewModel = await this.createFieldViewModel();
        viewModel.settings = new FieldSettings.DateTimeFieldSetting({
            readOnly: true
        });
        viewModel.content = new ContentTypes.Task({} as any, this.mockRepo);

        const contentViewElement = document.querySelector('date-time input') as HTMLInputElement;
        expect(contentViewElement.disabled).to.be.eq(true);
    }

    @test
    public async 'Required rule is added if complusory'() {
        

        const viewModel = await this.createFieldViewModel();
        viewModel.settings = new FieldSettings.DateTimeFieldSetting({
            compulsory: true
        });
        viewModel.content = new ContentTypes.Task({} as any, this.mockRepo);

        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq('required');
    }

    @test
    public async 'Date value and Time value is concatenated as an UTC value'(){

        const viewModel = await this.createFieldViewModel(); //contentViewElement.au.controller.viewModel as DateTime;
        viewModel.settings = new FieldSettings.DateTimeFieldSetting({
            compulsory: true
        });
        viewModel.content = new ContentTypes.Task({} as any, this.mockRepo);

        viewModel.localeService.Timezone = 'Europe/Budapest';
        viewModel.valueDate = '2017-01-01';
        viewModel.valueDateChanged();

        viewModel.valueTime = '10:00';
        viewModel.valueTimeChanged();

        expect(viewModel.value).to.be.eq('2017-01-01T09:00:00.000Z');

    }

    @test
    public async 'Value should be splitted and converted to local date and time'(){


        const viewModel = await this.createFieldViewModel();
        viewModel.settings = new FieldSettings.DateTimeFieldSetting({
            compulsory: true
        });
        viewModel.content = new ContentTypes.Task({} as any, this.mockRepo);

        viewModel.value = '2017-01-01T09:00:00.000Z';
        viewModel.localeService.Timezone = 'Europe/Budapest';        
        viewModel.valueChanged();

        expect(viewModel.valueTime).to.be.eq('10:00:00');
        expect(viewModel.valueDate).to.be.eq('2017-01 01');
    }

    @test
    public async 'Activate should trigger fillDateTimeValues'(){
        const viewModel = await this.createFieldViewModel();
        viewModel.settings = new FieldSettings.DateTimeFieldSetting({
            compulsory: true,
            name: 'DueDate'
        });
        viewModel.content = this.mockRepo.CreateContent({
            DueDate: '2017-01-01T09:00:00.000Z'
        } , ContentTypes.Task);
        viewModel.value = '2017-01-01T09:00:00.000Z';
        viewModel.localeService.Timezone = 'Europe/Budapest';

        viewModel.activate({
            settings: viewModel.settings,
            content: viewModel.content,
            controller: viewModel.controller,
            actionName: viewModel.actionName,
        });

        expect(viewModel.valueDate).to.be.eq('2017-01 01');
        expect(viewModel.valueTime).to.be.eq('10:00:00');
    }

        @test
    public async 'fillDateTimeValues shouldn\'t fill Date and Time with current DateTime if no value provided'(){
        const viewModel = await this.createFieldViewModel();
        viewModel.settings = new FieldSettings.DateTimeFieldSetting({
            compulsory: true,
        });
        viewModel.content = new ContentTypes.Task({}, this.mockRepo);
        viewModel.fillDateTimeValues();

        expect(viewModel.valueDate).to.be.eq(undefined);
        expect(viewModel.valueTime).to.be.eq(undefined);
    }
}