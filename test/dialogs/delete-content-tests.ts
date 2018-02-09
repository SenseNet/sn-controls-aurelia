import { IContent } from "@sensenet/client-core";
import { IDisposable } from "@sensenet/client-utils";
import { ChoiceFieldSetting } from "@sensenet/default-content-types";
import { expect } from "chai";
import { DeleteContent } from "..";
import { ComponentTestHelper } from "../component-test-helper";

export const deleteContentTests = describe("delete Content dialog tests", () => {

    const createFieldViewModel = async () => {
        return await ComponentTestHelper.createAndGetViewModel<DeleteContent>("<delete-content-dialog></delete-content-dialog>", "delete-content-dialog");
    };

    let viewModel: DeleteContent & IDisposable;

    beforeEach(async () => {
        viewModel = await createFieldViewModel();
    });

    afterEach(() => {
        viewModel.dispose();
    });

    it("Can be created", () => {
        expect(viewModel).to.be.instanceof(DeleteContent);
    });

    it("Can be opened", () => {
        viewModel.open([{Id: 2397, Path: "Root/Example", Name: "Example", Type: "GenericContent"}]);
    });

    it("Can be dismissed", () => {
        viewModel.cancel();
    });
});
