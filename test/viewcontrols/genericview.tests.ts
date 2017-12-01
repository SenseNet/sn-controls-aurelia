import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ComponentTestBase } from '../component-test.base';
import { GenericView } from '../../src/viewcontrols';
import { autoinject } from 'aurelia-framework';

@suite('GenericView component')
@autoinject
export class GenericViewTests extends ComponentTestBase<GenericView> {

    @test
    public async 'Can be constructed'() {
        const testTask = this.mockRepo.HandleLoadedContent({Id: 12385, Path: 'root/path', Name: 'example'})
        const component = await this.createComponentAsync('<generic-view content.bind="content" action-name.bind="actionName"></generic-view>', { actionName: 'edit', content: testTask });
        const contentViewElement = document.querySelector('generic-view');
        expect(contentViewElement).to.be.instanceOf(HTMLElement);
        expect(component).to.be.instanceof(Object);
    }

    @test
    public async 'Can be activated'() {
        const testTask = this.mockRepo.HandleLoadedContent({Id: 12385, Path: 'root/path', Name: 'example'})
        await this.createComponentAsync('<generic-view content.bind="content" action-name.bind="actionName"></generic-view>', { actionName: 'edit', content: testTask });
        const contentViewElement = document.querySelector('generic-view') as any;
        const genericView = contentViewElement.au.controller.viewModel as GenericView;
        genericView.activate({
            actionName: 'new',
            content: testTask,
            schema: {} as any
        });
        expect(genericView.content).to.be.eq(testTask);
    }

    @test
    public async 'ActionName changed should reload the saved fields in case of changing to View'() {
        const testTask = this.mockRepo.HandleLoadedContent({ Name: 'original', Id: 23875, Path: 'Root/Test'});
        await this.createComponentAsync('<generic-view content.bind="content" action-name.bind="actionName"></generic-view>', { actionName: 'edit', content: testTask });
        const contentViewElement = document.querySelector('generic-view') as any;
        const genericView = contentViewElement.au.controller.viewModel as GenericView;
        genericView.activate({
            actionName: 'edit',
            content: testTask,
            schema: {} as any
        });

        genericView.content.Name = 'changed';
        genericView.actionName = 'view';
        genericView.actionNameChanged('view', 'edit');
        expect(genericView.content.Name).to.be.eq('original');
    }

}