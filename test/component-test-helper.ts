import { Repository } from "@sensenet/client-core";
import { IDisposable } from "@sensenet/client-utils";
import { bootstrap } from "aurelia-bootstrapper";
import { globalize, initialize } from "aurelia-pal-nodejs";
import { ComponentTester, StageComponent } from "aurelia-testing";
import { configure } from "../src/";

export class ComponentTestHelper {

    public static async createAndGetViewModel<T>(componentView: string, customElementName: string, bindingContext?: Partial<T>): Promise<T & IDisposable> {
        initialize();
        globalize();
        document.body.innerHTML = "";
        const component = await this.createComponentAsync<T>(componentView, bindingContext);
        const contentViewElement = document.querySelector(customElementName) as any;
        const viewModel = contentViewElement.au.controller.viewModel;
        viewModel.dispose = () => component.dispose();
        return viewModel as T & IDisposable;
    }

    public static async createComponentAsync<T>(componentView: string, bindingContext?: Partial<T>): Promise<ComponentTester> {
        const component = StageComponent
            .withResources()
            .inView(componentView)
            .boundTo(bindingContext as {});

        component.bootstrap((app) => {
            app.use.standardConfiguration();
            configure(app.use);
            return app.use;
        });
        await component.create(bootstrap);
        return component;
    }
}
