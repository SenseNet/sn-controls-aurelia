import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { FieldSettings } from 'sn-client-js';
import { RichText } from '../../src/fieldcontrols';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

@suite('RichText Field component')
export class RichTextFieldests extends FieldControlBaseTest<RichText> {

    constructor() {
        super(RichText, 'rich-text');
    }


    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createFieldViewModel();
        expect(viewModel).to.be.instanceof(RichText);
    }

    @test
    public async 'Quill can be initialized'() {
        const rt = new RichText();
        document.body.innerHTML = "<div class='quillTest'></div>";
        rt.quillElementRef = document.querySelector('.quillTest') as HTMLDivElement;
        // await rt.initializeQuill();
    }    

    @test
    public async 'Can not be modified if is read only'() {
        const viewModel = await this.createFieldViewModel();
        expect(viewModel)
    }

    @test
    public async 'Required rule is added if complusory'() {
        const settings = {
            Compulsory: true
        } as FieldSettings.LongTextFieldSetting;
        const content = this.mockRepo.HandleLoadedContent({Id: 265, Path: 'root/path', Name: 'ContentName'});

        const viewModel = await this.createFieldViewModel();
        viewModel.activate({
            settings: settings,
            content: content,
            controller: null as any,
            actionName: 'new'
        });
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq('required');
    }

    @test
    public async 'onQuillSelectionChange should update isSelected property'(){
        const viewModel = await this.createFieldViewModel();

        viewModel.isSelected = false;
        (window as any).getSelection = () => {return {baseNode: null}};
        viewModel.onQuillSelectionChange(null, null, null);
        expect(viewModel.isSelected).to.be.eq(false);

        (window as any).getSelection = () => {return {baseNode: {}}};
        viewModel.onQuillSelectionChange(null, null, null);
        expect(viewModel.isSelected).to.be.eq(false);

        viewModel.onQuillSelectionChange(1, null, null);
        expect(viewModel.isSelected).to.be.eq(true);

        (window as any).getSelection = () => {return {baseNode: viewModel.containerRef}};
        viewModel.onQuillSelectionChange(null, null, null);
        expect(viewModel.isSelected).to.be.eq(true);
    }
    
    @test
    public async 'onQuillTextChange should update value'(){
        
        const viewModel = await this.createFieldViewModel();
        viewModel.settings =  {
            Compulsory: true
        } as FieldSettings.LongTextFieldSetting;
        viewModel.content = this.mockRepo.HandleLoadedContent({Id: 265, Path: 'root/path', Name: 'ContentName'});
        // await viewModel.initializeQuill();

        viewModel.textValue = 'test value';
        viewModel.value = '<p>test value</p>';
        (viewModel.quill as any).root.innerHTML = '<p>modified value</p>'
        viewModel.onQuillTextChange();
        expect(viewModel.value).to.be.eq('<p>modified value</p>');
    }
}