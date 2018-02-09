import { IDisposable } from "@sensenet/client-utils";
import { IntegerFieldSetting } from "@sensenet/default-content-types";
import { expect } from "chai";
import { Number as NumberField } from "../../src/fieldcontrols";
import { ComponentTestHelper} from "../component-test-helper";

export const numberTests = describe("NumberField component", () => {
    const createFieldViewModel = () => ComponentTestHelper.createAndGetViewModel<NumberField>("<number-field></number-field>", "number-field");

    let viewModel: NumberField & IDisposable;

    beforeEach(async () => {
        viewModel = await createFieldViewModel();
    });

    afterEach(() => {
        viewModel.dispose();
    });

    it("Can be constructed", async () => {
        expect (viewModel).to.be.instanceof(NumberField);
    });

    it("Can not be modified if is read only", async () => {
        viewModel.settings = {
            ReadOnly: true,
            Name: "Example",
        } as IntegerFieldSetting;
        viewModel.content = {Id: 12487, Path: "root/path", Name: "C1", Type: "User"};
        const contentViewElement = document.querySelector("number-field input") as HTMLInputElement;
        expect(contentViewElement.disabled).to.be.eq(true);
    });

    it("Required rule is added if complusory", async () => {
        viewModel.settings = {
            Compulsory: true,
        } as IntegerFieldSetting;
        viewModel.content = {Id: 12487, Path: "root/path", Name: "C1", Type: "User"};
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq("required");
    });
});
