import { IDisposable } from "@sensenet/client-utils";
import { LongTextFieldSetting } from "@sensenet/default-content-types";
import { expect } from "chai";
import { LongText } from "../../src/fieldcontrols";
import { ComponentTestHelper } from "../component-test-helper";

export const longTextTests = describe("LongText field component", () => {
    const createFieldViewModel = () => ComponentTestHelper.createAndGetViewModel<LongText>("<long-text></long-text>", "long-text");

    let viewModel: LongText & IDisposable;

    beforeEach(async () => {
        viewModel = await createFieldViewModel();
    });

    afterEach(() => {
        viewModel.dispose();
    });

    it("Can be constructed", () => {
        expect(viewModel).to.be.instanceof(LongText);
    });

    it("Can not be modified if is read only", () => {
        viewModel.content = {Id: 1285, Path: "root/path", Name: "", Type: "User"};
        viewModel.settings = {
            ReadOnly: true,
        } as LongTextFieldSetting;
        const contentViewElement = document.querySelector("long-text") as any;
        expect(contentViewElement.au.controller.viewModel.readOnly).to.be.eq(true);
    });

    it("Required rule is added if complusory", () => {
        viewModel.content = {Id: 1285, Path: "root/path", Name: "", Type: "User"};
        viewModel.settings = {
            Compulsory: true,
        } as LongTextFieldSetting;
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq("required");
    });

});
