import { IDisposable } from "@sensenet/client-utils/dist/Disposable";
import { FieldSetting } from "@sensenet/default-content-types";
import { expect } from "chai";
import "jsdom";
import { Checkbox } from "../../src/fieldcontrols";
import { ComponentTestHelper } from "../component-test-helper";

export const checkBoxTests = describe("Checkbox Tests", () => {

    const createFieldViewModel = async () => await ComponentTestHelper.createAndGetViewModel<Checkbox>("<checkbox></checkbox>", "checkbox", {
        content: { Id: 1, Name: "aaa", Path: "root/example", Type: "Content" },
    });
    let viewModel: Checkbox & IDisposable;

    beforeEach(async () => {
        try {
            viewModel = await createFieldViewModel();
        } catch {
            /** */
        }
    });

    afterEach(() => {
        try {
            viewModel.dispose();
        } catch {
            /** */
        }
    });

    it("Can be constructed", async () => {
        expect(viewModel).to.be.instanceof(Checkbox);
    });

    it("Can not be modified if is read only", async () => {
        viewModel.settings = {
            ReadOnly: true,
        } as FieldSetting;
        viewModel.content = { Id: 12387, Path: "asd", Name: "", Type: "" };
        const contentViewElement = document.querySelector("checkbox input") as HTMLInputElement;
        expect(contentViewElement.disabled).to.be.eq(true);
    });

    it("Required rule is added if complusory", async () => {
        viewModel.content = { Id: 123387, Path: "asd", Name: "", Type: "User" };
        viewModel.settings = {
            Compulsory: true,
        } as FieldSetting;
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq("required");
    });
});
