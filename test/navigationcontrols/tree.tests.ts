import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { Tree } from '../../src/navigationcontrols';
import { ContentTypes, Content, Authentication } from 'sn-client-js';
import { ComponentTestBase } from '../component-test.base';
import { ODataCollectionResponse } from 'sn-client-js/dist/src/ODataApi';
import { DragTypes } from '../../src/Enums';
import { LoginState } from 'sn-client-js/dist/src/Authentication';

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

        const testContent = this.mockRepo.CreateContent({ Path: 'example/path' }, ContentTypes.Task, );
        const testContent2 = this.mockRepo.CreateContent({ Path: 'another/example/path' }, ContentTypes.Task);

        viewModel.Content = testContent;
        viewModel.Selection = testContent2;

        expect(viewModel.IsSelected).to.be.eq(false);

        viewModel.Selection = testContent;
        expect(viewModel.IsSelected).to.be.eq(true)
    }


    @test
    public async 'IsSelected should return a valid value when no Selection is provided'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        const testContent = this.mockRepo.CreateContent({ Path: 'example/path' }, ContentTypes.Task, );
        viewModel.Content = testContent;
        viewModel.Selection = null as any;

        expect(viewModel.IsSelected).to.be.eq(false);

    }

    @test
    public async 'Expand() should be triggered if selection is below the actual Content'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');

        const testContent = this.mockRepo.CreateContent({ Path: 'example/path' }, ContentTypes.Task);
        const testContent2 = this.mockRepo.CreateContent({ Path: 'example/path/child' }, ContentTypes.Task);

        viewModel.Content = testContent;
        viewModel.Selection = testContent2;

        expect(viewModel.IsSelected).to.be.eq(false);
        expect(viewModel.IsExpanded).to.be.eq(true);
        expect(viewModel.IsLoading).to.be.eq(true);
    }


    @test
    public async 'HasChildren should be set based on the Children count'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        const testContent = this.mockRepo.CreateContent({ Path: 'example/path' }, ContentTypes.Task);
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

        viewModel.Content = this.mockRepo.CreateContent({ Path: 'example/path' }, ContentTypes.Task);
        this.mockRepo.Authentication.stateSubject.next(Authentication.LoginState.Authenticated);
        this.mockRepo.httpProviderRef.setError({ 'message': 'Whoooops' });
        try {
            await viewModel.Expand();
            throw new Error('Should have an error...');
        } catch (error) {
            expect(viewModel.IsLoading).to.be.eq(false);
        }
    }

    @test
    public async 'ContentChanged should handle change to a non-valid content'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');

        viewModel.Content = this.mockRepo.CreateContent({ Path: 'example/path' }, ContentTypes.Task);
        viewModel.Content['_lastSavedFields'] = null;
        viewModel.ContentChanged();
    }

    @test
    public async 'ContentChanged should handle change to a valid content'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example' }, ContentTypes.Task);
        viewModel.ContentChanged();
    }

    @test
    public async 'OnContentCreated should append a child'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example' }, ContentTypes.Task);
        viewModel.IsExpanded = true;
        const child = this.mockRepo.HandleLoadedContent({ Id: 2, Path: 'example/path/child', DisplayName: 'example' }, ContentTypes.Task);
        viewModel.handleContentCreated(child);
        expect(viewModel.Children[0]).to.be.eq(child);
    }

    @test
    public async 'OnContentDeleted should remove a Child'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example' }, ContentTypes.Task);
        viewModel.IsExpanded = true;
        const child = this.mockRepo.HandleLoadedContent({ Id: 2, Path: 'example/path/child', DisplayName: 'example' }, ContentTypes.Task);
        viewModel.Children = [child];
        viewModel.handleContentDeleted(child.GetFields());
        expect(viewModel.Children.filter(c => c && c.Id === child.Id).length).to.be.eq(0);
    }

    @test
    public async 'OnContentModified should reorder children if a modified Content is a Child'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example' }, ContentTypes.Task);
        viewModel.IsExpanded = true;
        const child = this.mockRepo.HandleLoadedContent({ Id: 2, Path: 'example/path/child', DisplayName: 'example' }, ContentTypes.Task);
        viewModel.Children = [child];
        viewModel.handleContentModified(child);
    }

    @test
    public async 'OnContentMoved should continue if the moved Content has nothing to do with the current Tree level'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example' }, ContentTypes.Task);
        viewModel.IsExpanded = true;
        const child = this.mockRepo.HandleLoadedContent({ Id: 2, Path: 'example2/path/child', DisplayName: 'example' }, ContentTypes.Task);
        viewModel.handleContentMoved(child, 'example2/path/child', 'example32/other/path');
        expect(viewModel.Children.filter(c => c && c.Id === child.Id).length).to.be.eq(0);
    }    

    @test
    public async 'OnContentMoved should remove child, if it was moved out'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example' }, ContentTypes.Task);
        viewModel.IsExpanded = true;
        const child = this.mockRepo.HandleLoadedContent({ Id: 2, Path: 'example/path/child', DisplayName: 'example' }, ContentTypes.Task);
        viewModel.Children = [child];
        viewModel.handleContentMoved(child, 'example/path/child', 'example2/other/path');
        expect(viewModel.Children.filter(c => c && c.Id === child.Id).length).to.be.eq(0);
    }


    @test
    public async 'OnContentMoved should start to reload a child if it was moved in'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example' }, ContentTypes.Task);
        viewModel.IsExpanded = true;
        const child = this.mockRepo.HandleLoadedContent({ Id: 2, Path: 'example/path/child', DisplayName: 'example' }, ContentTypes.Task);
        viewModel.handleContentMoved(child, 'example2/other/path', 'example/path');
        expect(viewModel.IsLoading).to.be.eq(true);
    }


    @test
    public 'OnContentMoved should remove IsLoading on success'(done) {
        this.createAndGetViewModel('<tree></tree>', 'tree').then(viewModel => {
            viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example' }, ContentTypes.Task);
            this.mockRepo.Authentication.stateSubject.next(LoginState.Authenticated);
            this.mockRepo.httpProviderRef.setResponse({
                d: viewModel.Content.GetFields
            })
            viewModel.IsExpanded = true;
            const child = this.mockRepo.HandleLoadedContent({ Id: 2, Path: 'example/path/child', DisplayName: 'example' }, ContentTypes.Task);
            viewModel.handleContentMoved(child, 'example2/other/path', 'example/path').subscribe(content => {
                expect(viewModel.IsLoading).to.be.eq(false);
                done();
            }, err => done);
        }, err => done)
    }


    @test
    public 'OnContentMoved should remove IsLoading on failure'(done) {
        this.createAndGetViewModel('<tree></tree>', 'tree').then(viewModel => {
            viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example' }, ContentTypes.Task);
            this.mockRepo.Authentication.stateSubject.next(LoginState.Authenticated);
            this.mockRepo.httpProviderRef.setError({
                message: ':('
            })
            viewModel.IsExpanded = true;
            const child = this.mockRepo.HandleLoadedContent({ Id: 2, Path: 'example/path/child', DisplayName: 'example' }, ContentTypes.Task);
            viewModel.handleContentMoved(child, 'example2/other/path', 'example/path').subscribe(content => {
                done('This should have failed');
            }, err => done());
        }, err => done)
    }        

    @test
    public async 'dragStart event'() {
        const evt = {
            dataTransfer: {
                setData: () => {},
                dropEffect: ''
            },
            stopPropagation: () => {}
        } as any;
         
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example' }, ContentTypes.Task);
        const returnValue = viewModel.dragStart(evt);
        expect(returnValue).to.be.eq(true);
        expect(evt.dataTransfer.dropEffect).to.be.eq('move')
    }

    @test
    public async 'dragEnd event'() {
        const evt = {
            stopPropagation: () => {},
            preventDefault: () => {}
        } as any;
         
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example' }, ContentTypes.Task);
        viewModel.dragEnd(evt);
    }
    
    @test
    public async 'dragEnter event'() {
        const evt = {
            stopPropagation: () => {},
            preventDefault: () => {}
        } as any;
         
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example' }, ContentTypes.Task);
        viewModel.dragEnter(evt);
    }

    @test
    public async 'dragOver event'() {
        const evt = {
            stopPropagation: () => {},
            preventDefault: () => {}
        } as any;
         
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example' }, ContentTypes.Task);
        const returnValue = viewModel.dragOver(evt);
        expect(returnValue).to.be.eq(true);
    }

    @test
    public async 'dragDrop event'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example' }, ContentTypes.Task);

        const droppedContent = this.mockRepo.HandleLoadedContent({ Id: 2, Path: 'example2/path', Name: 'example2', DisplayName: 'example2' }, ContentTypes.Task);

        const evt = {
            stopPropagation: () => {},
            preventDefault: () => {},
            dataTransfer: {
                types: [DragTypes.Content],
                getData: () => droppedContent.Stringify()
            }
        } as any;
         
        const returnValue = viewModel.dragDrop(evt);
        expect(returnValue).to.be.eq(true);
    }

}