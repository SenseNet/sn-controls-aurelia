import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { Tree } from '../../src/navigationcontrols';
import { Content, Authentication } from 'sn-client-js';
import { ComponentTestBase } from '../component-test.base';
import { ODataCollectionResponse } from 'sn-client-js/dist/src/ODataApi';
import { LoginState } from 'sn-client-js/dist/src/Authentication';
import { Task } from 'sn-client-js/dist/src/Content/DefaultContentTypes';

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

        const testContent = this.mockRepo.CreateContent({ Path: 'example/path' }, Task);
        const testContent2 = this.mockRepo.CreateContent({ Path: 'another/example/path' }, Task);

        viewModel.Content = testContent;
        viewModel.Selection = testContent2;

        expect(viewModel.IsSelected).to.be.eq(false);

        viewModel.Selection = testContent;
        expect(viewModel.IsSelected).to.be.eq(true)
    }


    @test
    public async 'IsSelected should return a valid value when no Selection is provided'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        const testContent = this.mockRepo.CreateContent({ Path: 'example/path' }, Task);
        viewModel.Content = testContent;
        viewModel.Selection = null as any;

        expect(viewModel.IsSelected).to.be.eq(false);

    }

    @test
    public async 'Expand() should be triggered if selection is below the actual Content'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');

        const testContent = this.mockRepo.CreateContent({ Path: 'example/path' }, Task);
        const testContent2 = this.mockRepo.CreateContent({ Path: 'example/path/child' }, Task);

        viewModel.Content = testContent;
        viewModel.Selection = testContent2;

        expect(viewModel.IsSelected).to.be.eq(false);
        expect(viewModel.IsExpanded).to.be.eq(true);
        expect(viewModel.IsLoading).to.be.eq(true);
    }


    @test
    public async 'HasChildren should be set based on the Children count'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        const testContent = this.mockRepo.CreateContent({ Path: 'example/path' }, Task);
        viewModel.Content = testContent;
        viewModel.Select();
        this.mockRepo.Authentication.StateSubject.next(Authentication.LoginState.Authenticated);
        this.mockRepo.HttpProviderRef.AddResponse({
            d: {
                __count: 0,
                results: []
            }
        } as ODataCollectionResponse<Content>);

        await viewModel.Expand();
        expect(viewModel.HasChildren).to.be.eq(false);

        viewModel.Toggle();

        this.mockRepo.HttpProviderRef.AddResponse({
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

        viewModel.Content = this.mockRepo.CreateContent({ Path: 'example/path' }, Task);
        this.mockRepo.Authentication.StateSubject.next(Authentication.LoginState.Authenticated);
        this.mockRepo.HttpProviderRef.AddError({ 'message': 'Whoooops' });
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

        viewModel.Content = this.mockRepo.CreateContent({ Path: 'example/path' }, Task);
        viewModel.Content['_lastSavedFields'] = null;
        viewModel.ContentChanged();
    }

    @test
    public async 'ContentChanged should handle change to a valid content'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example', Name: 'Example' });
        viewModel.ContentChanged();
    }

    @test
    public async 'OnContentCreated should append a child'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example', Name: 'Example'  });
        viewModel.IsExpanded = true;
        const child = this.mockRepo.HandleLoadedContent({ Id: 2, Path: 'example/path/child', DisplayName: 'example', Name: 'Example'  });
        viewModel.handleContentCreated({Content: child});
        expect(viewModel.Children[0]).to.be.eq(child);
    }

    @test
    public async 'OnContentDeleted should remove a Child'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example', Name: 'Example'  });
        viewModel.IsExpanded = true;
        const child = this.mockRepo.HandleLoadedContent({ Id: 2, Path: 'example/path/child', DisplayName: 'example', Name: 'Example'  });
        viewModel.Children = [child];
        viewModel.handleContentDeleted({ContentData: child.GetFields(), Permanently: true});
        expect(viewModel.Children.filter(c => c && c.Id === child.Id).length).to.be.eq(0);
    }

    @test
    public async 'OnContentModified should reorder children if a modified Content is a Child'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example', Name: 'Example'  });
        viewModel.IsExpanded = true;
        const child = this.mockRepo.HandleLoadedContent({ Id: 2, Path: 'example/path/child', DisplayName: 'example', Name: 'Example'  });
        viewModel.Children = [child];
        viewModel.handleContentModified({Content: child} as any);
    }

    @test
    public async 'OnContentMoved should continue if the moved Content has nothing to do with the current Tree level'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example', Name: 'Example'  });
        viewModel.IsExpanded = true;
        const child = this.mockRepo.HandleLoadedContent({ Id: 2, Path: 'example2/path/child', DisplayName: 'example', Name: 'Example'  });
        viewModel.handleContentMoved({Content: child, From: 'example2/path/child', To: 'example32/other/path'});
        expect(viewModel.Children.filter(c => c && c.Id === child.Id).length).to.be.eq(0);
    }    

    @test
    public async 'OnContentMoved should remove child, if it was moved out'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example', Name: 'Example'  });
        viewModel.IsExpanded = true;
        const child = this.mockRepo.HandleLoadedContent({ Id: 2, Path: 'example/path/child', DisplayName: 'example', Name: 'Example'  });
        viewModel.Children = [child];
        viewModel.handleContentMoved({Content: child, From: 'example/path/child', To: 'example2/other/path'});
        expect(viewModel.Children.filter(c => c && c.Id === child.Id).length).to.be.eq(0);
    }


    @test
    public async 'OnContentMoved should start to reload a child if it was moved in'() {
        const viewModel = await this.createAndGetViewModel('<tree></tree>', 'tree');
        viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example', Name: 'Example'  });
        viewModel.IsExpanded = true;
        const child = this.mockRepo.HandleLoadedContent({ Id: 2, Path: 'example/path/child', DisplayName: 'example', Name: 'Example'  });
        viewModel.handleContentMoved({Content: child, From: 'example2/other/path', To: 'example/path'});
        expect(viewModel.IsLoading).to.be.eq(true);
    }


    @test
    public 'OnContentMoved should remove IsLoading on success'(done) {
        this.createAndGetViewModel('<tree></tree>', 'tree').then(viewModel => {
            viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example', Name: 'Example'  });
            this.mockRepo.Authentication.StateSubject.next(LoginState.Authenticated);
            this.mockRepo.HttpProviderRef.AddResponse({
                d: viewModel.Content.GetFields
            })
            viewModel.IsExpanded = true;
            const child = this.mockRepo.HandleLoadedContent({ Id: 2, Path: 'example/path/child', DisplayName: 'example', Name: 'Example'  });
            viewModel.handleContentMoved({Content: child, From: 'example2/other/path', To: 'example/path'}).subscribe(content => {
                expect(viewModel.IsLoading).to.be.eq(false);
                done();
            }, err => done);
        }, err => done)
    }


    @test
    public 'OnContentMoved should remove IsLoading on failure'(done) {
        this.createAndGetViewModel('<tree></tree>', 'tree').then(viewModel => {
            viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example', Name: 'Example'  });
            this.mockRepo.Authentication.StateSubject.next(LoginState.Authenticated);
            const dropped = this.mockRepo.HandleLoadedContent({ Id: 2, Path: 'example2/path2/child', Name: 'child', DisplayName: 'alma' });
            
            this.mockRepo.HttpProviderRef.AddResponse({
                d: dropped.GetFields()
            })
            viewModel.IsExpanded = true;
            this.mockRepo.Events.OnContentMoved.subscribe(ev => {
                expect(ev.To).to.be.eq(viewModel.Content.Path)
                done();
            }, done)
            viewModel.dropContent(null as any, dropped.Stringify());
        }, err => done)
    }


    @test
    public 'dropContent should add a child, if a dropped content can be moved below IsLoading on failure'(done) {
        this.createAndGetViewModel('<tree></tree>', 'tree').then(viewModel => {
            viewModel.Content = this.mockRepo.HandleLoadedContent({ Id: 1, Path: 'example/path', DisplayName: 'example', Name: 'Example'  });
            this.mockRepo.Authentication.StateSubject.next(LoginState.Authenticated);
            this.mockRepo.HttpProviderRef.AddError({
                message: ':('
            })
            viewModel.IsExpanded = true;
            const child = this.mockRepo.HandleLoadedContent({ Id: 2, Path: 'example/path/child', DisplayName: 'example', Name: 'Example'  });
            viewModel.handleContentMoved({Content: child, From: 'example2/other/path', To: 'example/path'}).subscribe(content => {
                done('This should have failed');
            }, err => done());
        }, err => done)
    }        

}