import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ComponentTestBase } from '../component-test.base';
import { ContentList } from '../../src/collectioncontrols';

@suite('ContentList component')
export class ContentListTests extends ComponentTestBase<ContentList> {

    constructor() {
        super();
    }

    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createAndGetViewModel('<content-list></content-list>', 'content-list');
        expect(viewModel).to.be.instanceof(ContentList);
    }


    @test
    public async 'HasScope() should be false if there is no Scope bound'() {
        const viewModel = await this.createAndGetViewModel('<content-list></content-list>', 'content-list');
        expect(viewModel.hasScope).to.be.equals(false);
    }

    @test
    public async 'HasScope() should be true if there is a valid Scope bound'() {
        const viewModel = await this.createAndGetViewModel('<content-list></content-list>', 'content-list');
        const scopeContent = this.mockRepo.HandleLoadedContent({
            Id: 123321,
            Path: 'Root/Example',
            Name: 'scope'
        });
        viewModel.Scope = scopeContent;
        expect(viewModel.hasScope).to.be.equals(true);
    }


    @test
    public async 'Repository() should return the Repository from a Scope content'() {
        const viewModel = await this.createAndGetViewModel('<content-list></content-list>', 'content-list');
        const scopeContent = this.mockRepo.HandleLoadedContent({
            Id: 123321,
            Path: 'Root/Example',
            Name: 'scope'
        });
        viewModel.Scope = scopeContent;
        expect(viewModel.Repository).to.be.equals(scopeContent.GetRepository());
    }

    @test
    public 'activateItem() should trigger the OnActivate() callback'(done: MochaDone) {
        this.createAndGetViewModel('<content-list></content-list>', 'content-list').then((viewModel) => {
            const content = this.mockRepo.HandleLoadedContent({
                Id: 123321,
                Path: 'Root/Example',
                Name: 'scope'
            });

            viewModel.OnActivate = (arg) => {
                expect(arg.content).to.be.eq(content);
                done();
            }
            viewModel.activateItem(content)
        });
    }

}