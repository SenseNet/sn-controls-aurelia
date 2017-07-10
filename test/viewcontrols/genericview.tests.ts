import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ComponentTestBase } from '../component-test.base';
import { GenericView } from '../../src/viewcontrols';
import { ContentTypes, ActionName, Content, Authentication } from 'sn-client-js';
import { autoinject } from 'aurelia-framework';
import { ValidationController } from 'aurelia-validation';

@suite('GenericView component')
@autoinject
export class GenericViewTests extends ComponentTestBase<GenericView> {

    @test
    public async 'Can be constructed'() {
        const testTask = new ContentTypes.Task({ Name: '' }, this.mockRepo);
        const component = await this.createComponentAsync('<generic-view content.bind="content" action-name.bind="actionName"></generic-view>', { actionName: 'edit', content: testTask });
        const contentViewElement = document.querySelector('generic-view');
    }

    @test
    public async 'Can be activated'() {
        const testTask = new ContentTypes.Task({ Name: '' }, this.mockRepo);
        const component = await this.createComponentAsync('<generic-view content.bind="content" action-name.bind="actionName"></generic-view>', { actionName: 'edit', content: testTask });
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
    public async 'edit should change actionName'() {
        const testTask = new ContentTypes.Task({ Name: '' }, this.mockRepo);
        const component = await this.createComponentAsync('<generic-view content.bind="content" action-name.bind="actionName"></generic-view>', { actionName: 'edit', content: testTask });
        const contentViewElement = document.querySelector('generic-view') as any;
        const genericView = contentViewElement.au.controller.viewModel as GenericView;
        genericView.activate({
            actionName: 'new',
            content: testTask,
            schema: {} as any
        });
        genericView.edit();
        expect(genericView.actionName).to.be.eq('edit');
    }

    @test
    public async 'view should change actionName'() {
        const testTask = new ContentTypes.Task({ Name: '' }, this.mockRepo);
        const component = await this.createComponentAsync('<generic-view content.bind="content" action-name.bind="actionName"></generic-view>', { actionName: 'edit', content: testTask });
        const contentViewElement = document.querySelector('generic-view') as any;
        const genericView = contentViewElement.au.controller.viewModel as GenericView;
        genericView.activate({
            actionName: 'new',
            content: testTask,
            schema: {} as any
        });
        genericView.view();
        expect(genericView.actionName).to.be.eq('view');
    }


    @test
    public 'save should send a PATCH request'(done) {
        const testTask = Content.HandleLoadedContent(ContentTypes.Task, { Name: '', Id: 1 }, this.mockRepo); // new ContentTypes.Task({ Name: '' }, this.mockRepo);
        this.createComponentAsync('<generic-view content.bind="content" action-name.bind="actionName"></generic-view>', { actionName: 'edit', content: testTask }).then((component) => {
            const contentViewElement = document.querySelector('generic-view') as any;
            const genericView = contentViewElement.au.controller.viewModel as GenericView;
            testTask.DisplayName = 'modifiedDisplayName';
            genericView.activate({
                actionName: 'new',
                content: testTask,
                schema: {} as any
            });
            this.mockRepo.httpProviderRef.setResponse(testTask.GetFields());
            this.mockRepo.Authentication.stateSubject.next(Authentication.LoginState.Authenticated);
            this.mockRepo.httpProviderRef.UseTimeout = true;
            genericView.save().subscribe(resp => {
                expect(this.mockRepo.httpProviderRef.lastOptions.method).to.be.eq('PATCH');
                done();
            }, done);

        }, done);
    }

}