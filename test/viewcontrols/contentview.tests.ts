import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ComponentTestBase } from '../component-test.base';
import { ContentView } from '../../src/viewcontrols';
import { ContentTypes } from 'sn-client-js';

@suite('ContentView component')
export class ContentViewTests extends ComponentTestBase<ContentView> {

    @test
    public async 'Can be constructed'() {
        const component = await this.createComponentAsync('<content-view content.bind="content" action-name.bind="actionName"></content-view>', { actionName: 'new', content: null as any });
        const contentViewElement = document.querySelector('content-view');
        expect(contentViewElement).to.be.instanceOf(HTMLElement);
        expect(component).to.be.instanceof(Object);        
    }

    @test
    public async 'Content can be Bound'() {
        const testTask = this.mockRepo.HandleLoadedContent({ 
            Id: 234,
            Path: 'Root/Test',
            DueDate: '2017-01-01T11:11:11Z',
            Name: '' },
        ContentTypes.Task);
        const component = await this.createComponentAsync('<content-view content.bind="content" action-name.bind="actionName"></content-view>', { 
            actionName: 'edit',
            content: testTask
        });
        const contentViewElement = document.querySelector('content-view');
        expect(contentViewElement).to.be.instanceOf(HTMLElement);
        expect(component).to.be.instanceof(Object);
    }

    @test
    public async 'actionName should be View when no content has been assigned'() {
        const component = await this.createComponentAsync('<content-view content.bind="content" action-name.bind="actionName"></content-view>', { actionName: 'view', content: undefined });
        const contentViewElement = document.querySelector('content-view') as any;
        const contentViewModel = contentViewElement.au.controller.viewModel as ContentView;
        expect(contentViewModel.actionName).to.be.eq('view');
        expect(component).to.be.instanceof(Object);
    }

    @test
    public async 'actionName should be View by default on saved contents'() {
        const content = this.mockRepo.HandleLoadedContent({} as any, ContentTypes.Task);
        const component = await this.createComponentAsync('<content-view content.bind="content" action-name.bind="actionName"></content-view>', { actionName: 'view', content: content });
        const contentViewElement = document.querySelector('content-view') as any;
        const contentViewModel = contentViewElement.au.controller.viewModel as ContentView;
        contentViewModel.content = content;       
        expect(contentViewModel.actionName).to.be.eq('view');
        expect(component).to.be.instanceof(Object);

    }
        
}