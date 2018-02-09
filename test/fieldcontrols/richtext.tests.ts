import { IDisposable } from "@sensenet/client-utils";
import { LongTextFieldSetting } from "@sensenet/default-content-types";
import { expect } from "chai";
import { RichText } from "../../src/fieldcontrols";
import { ComponentTestHelper } from "../component-test-helper";

export const richTextFieldTests = describe("RichText Field component", () => {
    const createFieldViewModel = () => ComponentTestHelper.createAndGetViewModel<RichText>("<rich-text></rich-text>", "rich-text");

    let viewModel: RichText & IDisposable;

    beforeEach(async () => {
        viewModel = await createFieldViewModel();
    });

    afterEach(() => {
        viewModel.dispose();
    });

    it("Can be constructed", () => {
        expect(viewModel).to.be.instanceof(RichText);
    });

    it("Quill can be initialized", async () => {
        viewModel.quillElementRef = document.querySelector(".quillTest") as HTMLDivElement;
        // await rt.initializeQuill();
    });

    it("Required rule is added if complusory", async () => {
        const settings = {
            Compulsory: true,
        } as LongTextFieldSetting;
        const content = { Id: 265, Path: "root/path", Name: "ContentName", Type: "User" };

        viewModel.activate({
            settings,
            content,
            controller: null as any,
            actionName: "new",
        });
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq("required");
    });

    it("onQuillSelectionChange should update isSelected property", async () => {

        viewModel.isSelected = false;
        (window as any).getSelection = () => ({ baseNode: null });
        viewModel.onQuillSelectionChange(null, null, null);
        expect(viewModel.isSelected).to.be.eq(false);

        (window as any).getSelection = () => ({ baseNode: {} });
        viewModel.onQuillSelectionChange(null, null, null);
        expect(viewModel.isSelected).to.be.eq(false);

        viewModel.onQuillSelectionChange({index: 0, length: 1}, null, null);
        expect(viewModel.isSelected).to.be.eq(true);

        (window as any).getSelection = () => ({ baseNode: viewModel.containerRef });
        viewModel.onQuillSelectionChange(null, null, null);
        expect(viewModel.isSelected).to.be.eq(true);
    });

    it("onQuillTextChange should update value", async () => {

        viewModel.settings = {
            Compulsory: true,
        } as LongTextFieldSetting;
        viewModel.content = { Id: 265, Path: "root/path", Name: "ContentName", Type: "Task" };
        viewModel.textValue = "test value";
        viewModel.value = "<p>test value</p>";
        (viewModel.quill as any).root.innerHTML = "<p>modified value</p>";
        viewModel.onQuillTextChange();
        expect(viewModel.value).to.be.eq("<p>modified value</p>");
    });

});
