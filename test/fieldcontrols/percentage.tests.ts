import { IDisposable } from "@sensenet/client-utils";
import { NumberFieldSetting, Task } from "@sensenet/default-content-types";
import { expect } from "chai";
import { Percentage } from "../../src/fieldcontrols";
import { ComponentTestHelper } from "../component-test-helper";

export const percentageComponentTests = describe("Percentage component", () => {
    const createFieldViewModel = () => ComponentTestHelper.createAndGetViewModel<Percentage>("<percentage></percentage>", "percentage");

    let viewModel: Percentage & IDisposable;

    beforeEach(async () => {
        viewModel = await createFieldViewModel();
    });

    afterEach(() => {
        viewModel.dispose();
    });

    it("Can be constructed", () => {
        expect(viewModel).to.be.instanceof(Percentage);
    });

    it("Can not be modified if is read only", () => {
        viewModel.settings = {
            ReadOnly: true,
        } as NumberFieldSetting;
        viewModel.content = {Id: 12487, Path: "root/path", Name: "C1", Type: "User"};
        const contentViewElement = document.querySelector("percentage .mdc-slider") as HTMLInputElement;
        expect(contentViewElement.getAttribute("aria-disabled")).to.be.eq("true");
    });

    it("Value will be bound back on change", () => {
        const content: Task = {
            Id: 12976,
            Path: "root/path",
            Name: "TestTask",
            TaskCompletion: 5,
            Type: "Task",
        };

        const settings = {
            ReadOnly: true,
            Name: "TaskCompletion",
        } as NumberFieldSetting;
        viewModel.activate({content, settings, controller: null as any, actionName: "edit" });

        viewModel.mdcSlider.stepUp(6);
        viewModel.mdcSlider.emit("MDCSlider:change");
        expect(viewModel.value).to.be.eq(6);
    });

});
