import { expect } from "chai";
import { Breadcrumbs } from "../../src/index";
import { ComponentTestHelper } from "../component-test-helper";

export const breadcrumbsTests = describe("Breadcrumbs component", () => {

    const createAndGetViewModel = () => ComponentTestHelper.createAndGetViewModel<Breadcrumbs>("<breadcrumbs></breadcrumbs>", "breadcrumbs");

    it("Should be initialized", async () => {
        const viewModel = await createAndGetViewModel();
        expect(viewModel).to.be.instanceof(Breadcrumbs);
    });

    it("Should return empty segments array if no Selection is provided", async () => {
        const viewModel = await createAndGetViewModel();
        expect(viewModel.segments.length).to.be.eq(0);
    });

    it("Should return empty segments array if the Selection has no Path", async () => {
        const viewModel = await createAndGetViewModel();
        const selection = {Name: "Test", Id: 235235, Path: "", Type: "Task"};
        viewModel.selection = selection;
        expect(viewModel.segments.length).to.be.eq(0);
    });

    it("Should return a proper segments array", async () => {
        const viewModel = await createAndGetViewModel();
        const selection = {Name: "Test", Path: "Root/Test", Id: 235235, Type: "user"};
        viewModel.selection = selection;
        expect(viewModel.segments.length).to.be.eq(2);
        expect(viewModel.segments[0]).to.be.deep.eq({name: "Root", path: "/Root"});
        expect(viewModel.segments[1]).to.be.deep.eq({name: "Test", path: "/Root/Test"});
    });
});
