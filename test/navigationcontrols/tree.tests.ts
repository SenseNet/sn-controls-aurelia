import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { bootstrap } from 'aurelia-bootstrapper';
import { Tree } from '../../src/navigationcontrols';
import { ContentTypes, ActionName, FieldSettings, Retrier, Content, Authentication } from 'sn-client-js';
import { ValidationController, ValidateBindingBehavior } from 'aurelia-validation';
import { ComponentTestBase } from '../component-test.base';
import { ODataCollectionResponse } from 'sn-client-js/dist/src/ODataApi';

@suite('Tree component')
export class TreeTests extends ComponentTestBase<Tree> {

    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        expect(viewModel).to.be.instanceof(Tree);
    }


    @test
    public async 'IsSelected should check Selection and Content by path'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');

        const testContent = Content.Create(ContentTypes.Task, { Path: 'example/path' }, this.mockRepo);
        const testContent2 = Content.Create(ContentTypes.Task, { Path: 'another/example/path' }, this.mockRepo);

        viewModel.Content = testContent;
        viewModel.Selection = testContent2;

        expect(viewModel.IsSelected).to.be.eq(false);

        viewModel.Selection = testContent;
        expect(viewModel.IsSelected).to.be.eq(true)
    }

    @test
    public async 'Expand() should be triggered if selection is below the actual Content'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');

        const testContent = Content.Create(ContentTypes.Task, { Path: 'example/path' }, this.mockRepo);
        const testContent2 = Content.Create(ContentTypes.Task, { Path: 'example/path/child' }, this.mockRepo);

        viewModel.Content = testContent;
        viewModel.Selection = testContent2;

        expect(viewModel.IsSelected).to.be.eq(false);
        expect(viewModel.IsExpanded).to.be.eq(true);
        expect(viewModel.IsLoading).to.be.eq(true);
    }


    @test
    public async 'HasChildren should be set based on the Children count'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');

        const testContent = Content.Create(ContentTypes.Task, { Path: 'example/path' }, this.mockRepo);
        const testContent2 = Content.Create(ContentTypes.Task, { Path: 'example/path/child' }, this.mockRepo);

        viewModel.Content = testContent;
        viewModel.Select();
        this.mockRepo.Authentication.stateSubject.next(Authentication.LoginState.Authenticated);
        this.mockRepo.httpProviderRef.setResponse({
            d: {
                __count: 0,
                results: []
            }
        } as ODataCollectionResponse<Content>);

        await viewModel.Expand();
        expect(viewModel.HasChildren).to.be.eq(false);

        viewModel.Toggle();

        this.mockRepo.httpProviderRef.setResponse({
            d: {
                __count: 0,
                results: [
                    { Id: 1, Name: 'TestContent', DisplayName: 'TestContent' }
                ]
            }
        } as ODataCollectionResponse<Content>);

        await viewModel.Expand();
        expect(viewModel.HasChildren).to.be.eq(true);
    }

    @test
    public async 'Should handle Load error'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');

        viewModel.Content = Content.Create(ContentTypes.Task, { Path: 'example/path' }, this.mockRepo);
        this.mockRepo.Authentication.stateSubject.next(Authentication.LoginState.Authenticated);
        this.mockRepo.httpProviderRef.setError({'message': 'Whoooops'});
        try {
            await viewModel.Expand();
            throw new Error('Should have an error...');
        } catch (error) {
            expect(viewModel.IsLoading).to.be.eq(false);
        }
    }
}