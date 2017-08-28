import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ContentTypes, FieldSettings } from 'sn-client-js';
import { ContentListReference } from '../../src/fieldcontrols';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

@suite('ContentListReferenceField component')
export class ContentListReferenceFieldests extends FieldControlBaseTest<ContentListReference> {

    constructor() {
        super(ContentListReference, 'contentlist-reference');
    }

    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createFieldViewModel();
        expect(viewModel).to.be.instanceof(ContentListReference);
    }

    @test
    public async 'Can not be modified if is read only'() {
        // ToDo
        // const viewModel = await this.createFieldViewModel();
        // viewModel.settings = new FieldSettings.ChoiceFieldSetting({
        //     readOnly: true
        // });
        // viewModel.content = new ContentTypes.Task({} as any, this.mockRepo);
        // const contentViewElement = document.querySelector('choice input') as HTMLInputElement;
        // expect(contentViewElement.disabled).to.be.eq(true);
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