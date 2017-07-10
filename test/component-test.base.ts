import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { StageComponent, ComponentTester } from 'aurelia-testing';
import { initialize, globalize } from 'aurelia-pal-nodejs';
import { AureliaBaseControl } from '../src/AureliaBaseControl';
import { Mocks, Repository } from 'sn-client-js';
import { configure } from '../src/';
import { bootstrap } from 'aurelia-bootstrapper';

export class ComponentTestBase<T extends AureliaBaseControl> {

    protected mockRepo: Mocks.MockRepository = new Mocks.MockRepository();
    private component: ComponentTester;

    protected async createAndGetViewModel(componentView: string, customElementName: string, bindingContext?: Partial<T>): Promise<T>{
        this.component = await this.createComponentAsync(componentView, bindingContext);
        const contentViewElement = document.querySelector(customElementName) as any;
        return contentViewElement.au.controller.viewModel as T;
    }

    before(){
        initialize();
        globalize();
        document.body.innerHTML = '';
    }
    
    after(){
        this.component && this.component.dispose();
    }

    async createComponentAsync(componentView: string, bindingContext?: Partial<T>): Promise<ComponentTester> {
        this.component = StageComponent
            .withResources()
            .inView(componentView)
            .boundTo(bindingContext)

        this.component.bootstrap(app => { 
            app.use.standardConfiguration();
            configure(app.use);
        });
        await this.component.create(bootstrap);
        return this.component;
    }
}