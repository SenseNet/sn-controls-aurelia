import { IDisposable } from "@sensenet/client-utils";
import { ShortTextFieldSetting } from "@sensenet/default-content-types";
import { expect } from "chai";
import { NameField } from "../../src/fieldcontrols";
import { ComponentTestHelper } from "../component-test-helper";

export const nameFieldTests = describe("NameField component", () => {
    const createFieldViewModel = () => ComponentTestHelper.createAndGetViewModel<NameField>("<name-field></name-field>", "name-field");

    let viewModel: NameField & IDisposable;

    beforeEach(async () => {
        viewModel = await createFieldViewModel();
    });

    afterEach(() => {
        viewModel.dispose();
    });

    it("Can be constructed", () => {
        expect(viewModel).to.be.instanceof(NameField);
    });

    it("Can not be modified if is read only", () => {
        viewModel.settings = {
            ReadOnly: true,
        } as ShortTextFieldSetting;
        viewModel.content = {Id: 1285, Path: "root/path", Name: "", Type: "User"};
        const contentViewElement = document.querySelector("name-field input") as HTMLInputElement;
        expect(contentViewElement.disabled).to.be.eq(true);
    });

    it("Required rule is added if complusory", () => {
        viewModel.settings = {
            Compulsory: true,
        } as ShortTextFieldSetting;
        viewModel.content = {Id: 1285, Path: "root/path", Name: "", Type: "User"};
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq("required");
    });

    it("ParentPath is set based on Content", () => {
        // No content
        expect(viewModel.parentPath).to.be.eq("");

        // Unsaved - Content Path
        viewModel.content = {Path: "root/content", Name: "", Type: ""} as any;
        expect(viewModel.parentPath).to.be.eq("root/content");

        // Saved - Parent Path from Content
        viewModel.content = {Path: "root/content", Id: 123, Name: "", Type: ""};
        expect(viewModel.parentPath).to.be.eq("root");

    });

});
