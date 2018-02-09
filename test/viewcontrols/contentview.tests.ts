import { expect } from "chai";
import { ContentView } from "../../src/viewcontrols";
import { ComponentTestHelper } from "../component-test-helper";

export const contentViewTests = describe("Content view tests", () => {
    const createComponent = () => ComponentTestHelper.createComponentAsync('<content-view content.bind="content" action-name.bind="actionName"></content-view>', { actionName: "new", content: {}});

    it("Can be constructed", async () => {
        const component = await createComponent();
        const contentViewElement = document.querySelector("content-view");
        expect(contentViewElement).to.be.instanceOf(HTMLElement);
        expect(component).to.be.instanceof(Object);
    });

    it("Content can be Bound", async () => {
        const testTask = {
            Id: 234,
            Path: "Root/Test",
            DueDate: "2017-01-01T11:11:11Z",
            Name: "",
            Type: "Task",
        };
        const component = await ComponentTestHelper.createComponentAsync('<content-view content.bind="content" action-name.bind="actionName"></content-view>', {
            actionName: "edit",
            content: testTask,
        });
        const contentViewElement = document.querySelector("content-view");
        expect(contentViewElement).to.be.instanceOf(HTMLElement);
        expect(component).to.be.instanceof(Object);
    });

    it("actionName should be View when no content has been assigned", async () => {
        const viewModel = await ComponentTestHelper.createAndGetViewModel<ContentView>("<content-view></content-view>", "content-view");
        expect(viewModel.actionName).to.be.eq("view");
    });

    it( "actionName should be View by default on saved contents", async () => {
        const content = {};
        const component = await ComponentTestHelper.createComponentAsync('<content-view content.bind="content" action-name.bind="actionName"></content-view>', { actionName: "view", content });
        const contentViewElement = document.querySelector("content-view") as any;
        const contentViewModel = contentViewElement.au.controller.viewModel as ContentView;
        contentViewModel.content = content as any;
        expect(contentViewModel.actionName).to.be.eq("view");
        expect(component).to.be.instanceof(Object);
    });
});
