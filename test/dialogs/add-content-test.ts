import { IContent } from "@sensenet/client-core";
import { IDisposable } from "@sensenet/client-utils";
import { ChoiceFieldSetting } from "@sensenet/default-content-types";
import { expect } from "chai";
import { AddContentDialog } from "..";
import { ComponentTestHelper } from "../component-test-helper";

export const addContentTests = describe("Add Content dialog tests", () => {

    const createFieldViewModel = async () => {
        return await ComponentTestHelper.createAndGetViewModel<AddContentDialog>("<add-content-dialog></add-content-dialog>", "add-content-dialog");
    };

    let viewModel: AddContentDialog & IDisposable;

    beforeEach(async () => {
        viewModel = await createFieldViewModel();
    });

    afterEach(() => {
        viewModel.dispose();
    });

    it("Can be created", () => {
        expect(viewModel).to.be.instanceof(AddContentDialog);
    });

    it("Parent can be assigned", () => {
        viewModel.parent = {Id: 2397, Path: "Root/Example", Name: "Example", Type: "GenericContent"};
    });

    it("Can be opened", () => {
        viewModel.open();
        expect(viewModel).to.be.instanceof(AddContentDialog);
    });

    it("Can be dismissed", () => {
        viewModel.cancel();
        expect(viewModel).to.be.instanceof(AddContentDialog);
    });
});
