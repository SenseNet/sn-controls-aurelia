import { PasswordFieldSetting } from "@sensenet/default-content-types";
import { expect } from "chai";
import { Password } from "../../src/fieldcontrols";
import { ComponentTestHelper } from "../component-test-helper";

export const passwordTests = describe("PasswordField tests", () => {
    const createFieldViewModel = () => ComponentTestHelper.createAndGetViewModel<Password>("<password-field></password-field>", "password-field");

    it("Can be constructed", async () => {
        const viewModel = await createFieldViewModel();
        expect(viewModel).to.be.instanceof(Password);
    });

    it("Can not be modified if is read only", async () => {
        const viewModel = await createFieldViewModel();
        viewModel.settings = {
            ReadOnly: true,
        } as PasswordFieldSetting;
        viewModel.content = {Id: 12487, Path: "root/path", Name: "C1", Type: "User"};
        const contentViewElement = document.querySelector("password-field input") as HTMLInputElement;
        expect(contentViewElement.disabled).to.be.eq(true);
    });

    it("Required rule is added if complusory", async () => {
        const viewModel = await createFieldViewModel();
        viewModel.settings = {
            Compulsory: true,
        } as PasswordFieldSetting;
        viewModel.content = {Id: 12487, Path: "root/path", Name: "C1", Type: "User"};
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq("required");
    });

});
