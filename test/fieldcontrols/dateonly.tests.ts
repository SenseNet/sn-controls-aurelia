import { IDisposable } from "@sensenet/client-utils";
import { DateTimeFieldSetting } from "@sensenet/default-content-types";
import { expect } from "chai";
import { DateOnly } from "../../src/fieldcontrols";
import { ComponentTestHelper } from "../component-test-helper";

export const dateOnlyFieldTests = describe("DateField component", () => {
    const createFieldViewModel = () => ComponentTestHelper.createAndGetViewModel<DateOnly>("<date-only></date-only>", "date-only");

    let viewModel: DateOnly & IDisposable;

    beforeEach(async () => {
        viewModel = await createFieldViewModel();
    });

    afterEach(() => {
        viewModel.dispose();
    });

    it("Can be constructed", () => {
        expect(viewModel).to.be.instanceof(DateOnly);
    });

    it("Can not be modified if is read only", () => {
        viewModel.settings = {
            ReadOnly: true,
        } as DateTimeFieldSetting;

        const contentViewElement = document.querySelector("date-only input") as HTMLInputElement;
        expect(contentViewElement.disabled).to.be.eq(true);
    });

    it("Required rule is added if complusory", () => {
        viewModel.settings = {
            Compulsory: true,
        } as DateTimeFieldSetting;
        viewModel.content = {Id: 12387, Path: "asd", Name: "", Type: "User"};
        viewModel.actionName = "new";

        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq("required");
    });

    it("Setting Value should update super's Value", () => {
        viewModel.settings = {
            Compulsory: true,
            DefaultValue: "1985-09-25T00:00:00Z",
        } as DateTimeFieldSetting;
        viewModel.content = {Id: 1387, Path: "asd", Name: "", Type: "User"};
        viewModel.dateValue = "2017-01-01T11:11:11Z";
        viewModel.dateValueChanged(viewModel.dateValue);
        expect(viewModel.value).to.be.eq("2017-01-01T00:00:00Z");
    });

    it("Setting Content Value should update component's value", () => {
        viewModel.settings = {
            Compulsory: true,
            DefaultValue: "1985-09-25T00:00:00Z",
        } as DateTimeFieldSetting;
        viewModel.content = {Id: 1237, Path: "asd", Name: "", Type: "User"};
        viewModel.value = "2017-01-01T11:11:11Z";
        viewModel.valueChanged(viewModel.value);
        expect(viewModel.dateValue).to.be.eq("2017-01-01");
    });

});
