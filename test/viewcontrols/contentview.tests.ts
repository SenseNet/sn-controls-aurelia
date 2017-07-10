import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ComponentTestBase } from '../component-test.base';
import { ContentView } from '../../src/viewcontrols';
import { ContentTypes, Content } from 'sn-client-js';

@suite('ContentView component')
export class ContentViewTests extends ComponentTestBase<ContentView> {

    @test
    public async 'Can be constructed'() {
        const component = await this.createComponentAsync('<content-view content.bind="content" action-name.bind="actionName"></content-view>', { actionName: 'new', content: null as any });
        const contentViewElement = document.querySelector('content-view');
    }

    @test
    public async 'Content can be Bound'() {
        const testTask = new ContentTypes.Task({ 
            DueDate: '2017-01-01T11:11:11Z',
            Name: '' },
        this.mockRepo);
        const component = await this.createComponentAsync('<content-view content.bind="content" action-name.bind="actionName"></content-view>', { actionName: 'edit', content: testTask });
        const contentViewElement = document.querySelector('content-view');
    }

    @test
    public async 'actionName should be New when no content has been assigned'() {
        const component = await this.createComponentAsync('<content-view content.bind="content" action-name.bind="actionName"></content-view>', { actionName: 'edit', content: undefined });
        const contentViewElement = document.querySelector('content-view') as any;
        const contentViewModel = contentViewElement.au.controller.viewModel as ContentView;
        expect(contentViewModel.actionName).to.be.eq('new');
    }

    @test
    public async 'actionName should be View by default on saved contents'() {
        const content = Content.HandleLoadedContent(ContentTypes.Task, {}, this.mockRepo);
        const component = await this.createComponentAsync('<content-view content.bind="content" action-name.bind="actionName"></content-view>', { actionName: 'edit', content: content });
        const contentViewElement = document.querySelector('content-view') as any;
        const contentViewModel = contentViewElement.au.controller.viewModel as ContentView;
        contentViewModel.content = content;       
        expect(contentViewModel.actionName).to.be.eq('view');
    }

    @test
    public async 'actionName should be New for unsaved content'() {
        const content = Content.Create(ContentTypes.Task, {}, this.mockRepo);
        const component = await this.createComponentAsync('<content-view content.bind="content" action-name.bind="actionName"></content-view>', { actionName: 'edit', content: content });
        const contentViewElement = document.querySelector('content-view') as any;
        const contentViewModel = contentViewElement.au.controller.viewModel as ContentView;
        contentViewModel.content = content;
        expect(contentViewModel.actionName).to.be.eq('new');
    }            
}