import { expect } from "chai";
import { DumpField } from "../../src/fieldcontrols";
import { ComponentTestHelper } from "../component-test-helper";

export const dumpFieldTests = describe("DumpField component", () => {
    const createFieldViewModel = () => ComponentTestHelper.createAndGetViewModel<DumpField>("<dump-field></dump-field>", "dump-field");

    it("Can be constructed", async () => {
        const viewModel = await createFieldViewModel();
        expect(viewModel).to.be.instanceof(DumpField);
        viewModel.dispose();
    });

});
