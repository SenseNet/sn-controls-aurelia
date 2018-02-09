import { expect } from "chai";
import { Icon } from "../../src/fieldcontrols";
import { ComponentTestHelper } from "../component-test-helper";

export const iconComponentTests = describe("Icon Component", () => {
    const createFieldViewModel = () => ComponentTestHelper.createAndGetViewModel<Icon>("<icon></icon>", "icon");

    it("Can be constructed", async () => {
        const viewModel = await createFieldViewModel();
        expect(viewModel).to.be.instanceof(Icon);
        viewModel.dispose();
    });
});
