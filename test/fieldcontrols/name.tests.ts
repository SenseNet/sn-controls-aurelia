import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { FieldSettings } from 'sn-client-js';
import { NameField } from '../../src/fieldcontrols';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';
import { User } from 'sn-client-js/dist/src/ContentTypes';

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
        viewModel.settings = {
            ReadOnly: true
        } as FieldSettings.ShortTextFieldSetting;
        viewModel.content = this.mockRepo.HandleLoadedContent({Id: 1285, Path: 'root/path', Name: ''})

        const contentViewElement = document.querySelector('name-field input') as HTMLInputElement;

        expect(contentViewElement.disabled).to.be.eq(true);

    }

    @test
    public async 'Required rule is added if complusory'() {
        const viewModel = await this.createFieldViewModel();
        viewModel.settings = {
            Compulsory: true
        } as FieldSettings.ShortTextFieldSetting;
        viewModel.content = this.mockRepo.HandleLoadedContent({Id: 1285, Path: 'root/path', Name: ''})
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq('required');
    }

    @test
    public async 'ParentPath is set based on Content'(){
        const viewModel = await this.createFieldViewModel();
        // No content
        expect(viewModel.parentPath).to.be.empty;

        // Unsaved - Content Path
        viewModel.content = this.mockRepo.CreateContent({Path: 'root/content'}, User);
        expect(viewModel.parentPath).to.be.eq('root/content');

        // Saved - Parent Path from Content
        viewModel.content = this.mockRepo.HandleLoadedContent<User>({Path: 'root/content', Id: 123} as any);
        expect(viewModel.parentPath).to.be.eq('root');


    }
}