import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';
import { ContentTypes, FieldSettings } from 'sn-client-js';
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
        viewModel.settings = new FieldSettings.DateTimeFieldSetting({
            readOnly: true
        });

        const contentViewElement = document.querySelector('date-only input') as HTMLInputElement;        
        expect(contentViewElement.disabled).to.be.eq(true);

    }

    @test
    public async 'Required rule is added if complusory'() {
        const viewModel = await this.createFieldViewModel();
        viewModel.settings = new FieldSettings.DateTimeFieldSetting({
            compulsory: true
        });
        viewModel.content = new ContentTypes.Task({} as any, this.mockRepo);
        viewModel.actionName = 'new';

        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq('required');
    }

    @test
    public async 'Setting Value should update super\'s Value'(){
        const viewModel = await this.createFieldViewModel();
        viewModel.settings = new FieldSettings.DateTimeFieldSetting({
            compulsory: true
        });
        viewModel.content = new ContentTypes.Task({} as any, this.mockRepo);
        viewModel.value = '2017-01-01T11:11:11Z';
        expect(viewModel.value).to.be.eq('2017-01-01T00:00:00Z');
    }
}