import { IDisposable } from "@sensenet/client-utils";
import { ShortTextFieldSetting } from "@sensenet/default-content-types";
import { expect } from "chai";
import { ShortText } from "../../src/fieldcontrols";
import { ComponentTestHelper } from "../component-test-helper";

export const shortTextTests = describe("ShortText component", () => {
    const createFieldViewModel = () => ComponentTestHelper.createAndGetViewModel<ShortText>("<short-text></short-text>", "short-text");

    let viewModel: ShortText & IDisposable;

    beforeEach(async () => {
        viewModel = await createFieldViewModel();
    });

    afterEach(() => {
        viewModel.dispose();
    });

    it("Can be constructed", () => {
        expect(viewModel).to.be.instanceof(ShortText);
    });

    it("Can not be modified if is read only", () => {
        viewModel.settings = {
            ReadOnly: true,
        } as ShortTextFieldSetting;
        viewModel.content = { Id: 12385, Path: "root/path", Name: "example", Type: "User" };
        const contentViewElement = document.querySelector("short-text input") as HTMLInputElement;
        expect(contentViewElement.disabled).to.be.eq(true);
    });

    it("Required rule is added if complusory", () => {
        viewModel.settings = {
            Compulsory: true,
        } as ShortTextFieldSetting;
        viewModel.content = { Id: 12385, Path: "root/path", Name: "example", Type: "User" };
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq("required");
    });

});
