import { Repository } from "@sensenet/client-core";
import { IDisposable } from "@sensenet/client-utils";
import { autoinject } from "aurelia-framework";
import { expect } from "chai";
import { GenericView } from "../../src/viewcontrols";
import { ComponentTestHelper } from "../component-test-helper";

export const genericViewTests = describe("GenericView component", () => {

    const getComponent = () => ComponentTestHelper.createAndGetViewModel<GenericView>("<generic-view></generic-view>", "generic-view");

    let component: GenericView & IDisposable;

    beforeEach(async () => {
        component = await getComponent();
    });

    afterEach(() => {
        component.dispose();
    });

    it( "Can be constructed", async () => {
        expect(component).to.be.instanceof(GenericView);
    });

    it("Can be activated", async () => {
        const testTask = {Id: 12385, Path: "root/path", Name: "example", Type: "Task"};
        // tslint:disable-next-line:no-string-literal
        component["repository"] = new Repository({}, async () => ({ok: true, json: async () => ({})} as any));
        component.activate({
            actionName: "new",
            content: testTask,
            schema: {schema: { FieldSettings: []}} as any,
        });
        expect(component.content).to.be.eq(testTask);
    });
});
