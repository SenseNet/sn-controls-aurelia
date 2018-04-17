import { IContent } from "@sensenet/client-core";
import { IDisposable } from "@sensenet/client-utils";
import { ChoiceFieldSetting } from "@sensenet/default-content-types";
import { expect } from "chai";
import { SetPermissionsDialog } from "..";
import { ComponentTestHelper } from "../component-test-helper";

export const setPermissionsTests = describe("Set Permissions dialog tests", () => {

    // ToDo: fix after real implementation

    // const createFieldViewModel = async () => {
    //     return await ComponentTestHelper.createAndGetViewModel<SetPermissionsDialog>("<set-permissions-dialog></set-permissions-dialog>", "set-permissions-dialog");
    // };

    // let viewModel: SetPermissionsDialog & IDisposable;

    // beforeEach(async () => {
    //     viewModel = await createFieldViewModel();
    // });

    // afterEach(() => {
    //     viewModel.dispose();
    // });

    // it("Can be created", () => {
    //     expect(viewModel).to.be.instanceof(SetPermissionsDialog);
    // });

    // it("Can be opened", () => {
    //     viewModel.open({Id: 2397, Path: "Root/Example", Name: "Example", Type: "GenericContent"});
    // });

});
