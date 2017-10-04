import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ContentTypes, FieldSettings } from 'sn-client-js';
import { NameField } from '../../src/fieldcontrols';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

@suite('NameField component')
export class NameTests extends FieldControlBaseTest<NameField> {

    /**
     *
     */
    constructor() {
        super(NameField, 'name-field');

    }

    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createFieldViewModel();
        expect(viewModel).to.be.instanceof(NameField);
    }

    @test
    public async 'Can not be modified if is read only'() {
        const viewModel = await this.createFieldViewModel();
        viewModel.settings = new FieldSettings.ChoiceFieldSetting({
            readOnly: true
        });
        viewModel.content = new ContentTypes.Task({} as any, this.mockRepo);

        const contentViewElement = document.querySelector('name-field input') as HTMLInputElement;

        expect(contentViewElement.disabled).to.be.eq(true);

    }

    @test
    public async 'Required rule is added if complusory'() {
        const viewModel = await this.createFieldViewModel();
        viewModel.settings = new FieldSettings.ChoiceFieldSetting({
            compulsory: true
        });
        viewModel.content = new ContentTypes.Task({} as any, this.mockRepo);
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq('required');
    }

    @test
    public async 'ParentPath is set based on Content'(){
        const viewModel = await this.createFieldViewModel();
        // No content
        expect(viewModel.parentPath).to.be.empty;

        // Unsaved - Content Path
        viewModel.content = this.mockRepo.CreateContent({Path: 'root/content'}, ContentTypes.User);
        expect(viewModel.parentPath).to.be.eq('root/content');

        // Saved - Parent Path from Content
        viewModel.content = this.mockRepo.HandleLoadedContent({Path: 'root/content', Id: 123}, ContentTypes.User);
        expect(viewModel.parentPath).to.be.eq('root');


    }
}