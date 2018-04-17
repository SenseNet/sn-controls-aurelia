import { IContent } from "@sensenet/client-core";
import { IDisposable } from "@sensenet/client-utils";
import { ChoiceFieldSetting } from "@sensenet/default-content-types";
import { expect } from "chai";
import { EditContentDialog } from "..";
import { ComponentTestHelper } from "../component-test-helper";

export const editContentTests = describe("Edit Content dialog tests", () => {

    const createFieldViewModel = async () => {
        return await ComponentTestHelper.createAndGetViewModel<EditContentDialog>("<edit-content-dialog></edit-content-dialog>", "edit-content-dialog");
    };

    let viewModel: EditContentDialog & IDisposable;

    beforeEach(async () => {
        viewModel = await createFieldViewModel();
    });

    afterEach(() => {
        viewModel.dispose();
    });

    it("Can be created", () => {
        expect(viewModel).to.be.instanceof(EditContentDialog);
    });

    it("Parent can be assigned", () => {
        viewModel.parent = {Id: 2397, Path: "Root/Example", Name: "Example", Type: "GenericContent"};
    });

    it("Can be opened", () => {
        viewModel.open({Id: 2397, Path: "Root/Example", Name: "Example", Type: "GenericContent"});
    });

    it("Can be saved", () => {
        viewModel.save();
    });

    it("Can be dismissed", () => {
        viewModel.cancel();
    });
});
