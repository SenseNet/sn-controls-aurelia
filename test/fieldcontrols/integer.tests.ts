import { IDisposable } from "@sensenet/client-utils";
import { IntegerFieldSetting } from "@sensenet/default-content-types";
import { expect } from "chai";
import { Integer } from "../../src/fieldcontrols";
import { ComponentTestHelper } from "../component-test-helper";

export const integerFieldTests = describe("Integer field component", () => {
    const createFieldViewModel = () => ComponentTestHelper.createAndGetViewModel<Integer>("<integer-field></integer-field>", "integer-field");

    let viewModel: Integer & IDisposable;

    beforeEach(async () => {
        viewModel = await createFieldViewModel();
    });

    afterEach(() => {
        viewModel.dispose();
    });

    it("Can be constructed", () => {
        expect(viewModel).to.be.instanceof(Integer);
    });

    it("Can not be modified if is read only", () => {
        viewModel.settings = {
            ReadOnly: true,
        } as IntegerFieldSetting;
        viewModel.content = {Id: 1285, Path: "root/path", Name: "", Type: "User"};
        const contentViewElement = document.querySelector("integer-field input") as HTMLInputElement;
        expect(contentViewElement.disabled).to.be.eq(true);
    });

    it("Required rule is added if complusory", () => {
        viewModel.content = {Id: 1285, Path: "root/path", Name: "", Type: "User"};
        viewModel.settings = {
            Compulsory: true,
        } as IntegerFieldSetting;

        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq("required");
    });

});
