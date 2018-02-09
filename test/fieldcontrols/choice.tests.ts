import { IContent } from "@sensenet/client-core";
import { IDisposable } from "@sensenet/client-utils";
import { ChoiceFieldSetting } from "@sensenet/default-content-types";
import { expect } from "chai";
import { Choice } from "../../src/fieldcontrols";
import { ComponentTestHelper } from "../component-test-helper";

export const choiceFieldTests = describe("", () => {

    const createFieldViewModel = async () => {
        return await ComponentTestHelper.createAndGetViewModel<Choice>("<choice></choice>", "choice");
    };

    let viewModel: Choice & IDisposable;

    beforeEach(async () => {
        viewModel = await createFieldViewModel();
    });

    afterEach(() => {
        viewModel.dispose();
    });

    it("Can be constructed", async () => {
        expect(viewModel).to.be.instanceof(Choice);
    });

    it("Can not be modified if is read only", async () => {
        viewModel.settings = {
            ReadOnly: true,
        } as ChoiceFieldSetting;
        viewModel.content = {Id: 12387, Path: "asd", Name: "", Type: "User"};
        const contentViewElement = document.querySelector("choice input") as HTMLInputElement;
        expect(contentViewElement.disabled).to.be.eq(true);
    });

    it("Writes back value when changed", async () => {
        const content: IContent = {Id: 1237, Path: "asd", Name: "", Type: ""};
        expect(viewModel.value).to.be.eq(undefined);
        const settings = {
            Compulsory: true,
            DefaultValue: "Value1",
            Options: [
                {
                    Enabled: true,
                    Value: "Value1",
                    Text: "Value1",
                },
                {
                    Enabled: true,
                    Value: "Value2",
                    Text: "Value2",
                },

            ],
        } as ChoiceFieldSetting;
        viewModel.activate({ content, settings });

        viewModel.mdcSelect.emit("MDCSelect:change");
        expect(viewModel.value[0]).of.be.eq("Value1");
    });

});
