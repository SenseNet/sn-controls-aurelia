import { IDisposable } from "@sensenet/client-utils";
import { ShortTextFieldSetting } from "@sensenet/default-content-types";
import { expect } from "chai";
import { DisplayName } from "../../src/fieldcontrols";
import { ComponentTestHelper } from "../component-test-helper";

export const displayNameTests = describe("DisplayName component", () => {
    const createFieldViewModel = () => ComponentTestHelper.createAndGetViewModel<DisplayName>("<display-name></display-name>", "display-name");

    let viewModel: DisplayName & IDisposable;

    beforeEach(async () => {
        viewModel = await createFieldViewModel();
    });

    afterEach(() => {
        viewModel.dispose();
    });

    it("Can be constructed", () =>  {
        expect(viewModel).to.be.instanceof(DisplayName);
    });

    it("Can not be modified if is read only", () => {
        viewModel.settings = {
            ReadOnly: true,
        } as ShortTextFieldSetting;
        expect(viewModel.readOnly).to.be.eq(true);
    });

    it("Required rule is added if complusory", () => {
        viewModel.settings = {
            Compulsory: true,
        } as ShortTextFieldSetting;
        viewModel.content = {Id: 1285, Path: "root/path", Name: "", Type: "User"};
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq("required");
    });

});
