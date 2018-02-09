import { Repository } from "@sensenet/client-core";
import { IODataCollectionResponse } from "@sensenet/client-core";
import { IDisposable } from "@sensenet/client-utils";
import { Group, ReferenceFieldSetting, Task, User } from "@sensenet/default-content-types";
import { expect } from "chai";
import { ContentListReference } from "../../src/fieldcontrols";
import { ComponentTestHelper } from "../component-test-helper";

export const contentListReferenceFieldTests = describe("ContentListReferenceField", () => {
    const createFieldViewModel = () => ComponentTestHelper.createAndGetViewModel<ContentListReference>("<contentlist-reference></contentlist-reference>", "contentlist-reference");

    let viewModel: ContentListReference & IDisposable;

    beforeEach(async () => {
        viewModel = await createFieldViewModel();
        (global as any).window.fetch = async (...args: any[]) => {
            return {
                ok: true,
                json: async () => ({
                    d: {
                        __count: 1,
                        results: [{
                            Id: 4,
                            Name: "alma",
                            Path: "Root/Test",
                        }],
                    },
                } as IODataCollectionResponse<User>),
            } as any;
        };
    });

    afterEach(() => {
        viewModel.dispose();
    });

    it("Can be constructed", () => {
        const a = document.querySelector("contentlist-reference");
        expect(viewModel).to.be.instanceof(ContentListReference);
    });

    it("Can not be modified if is read only", () => {
        viewModel.settings = {
            ReadOnly: true,
        } as ReferenceFieldSetting;
        viewModel.content = { Id: 12387, Path: "asd", Name: "", Type: "" };
        const contentViewElement = document.querySelector("content-reference .search-box");
        expect(contentViewElement).to.be.eq(null);
    });

    it("Required rule is added if complusory", () => {
        const content = { Id: 123827, Path: "Root/Example/Test", Name: "Test", Type: "Task" };
        const settings = {
            Compulsory: true,
            Name: "Example",
        } as ReferenceFieldSetting;
        viewModel.activate({ content, settings });
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq("required");
    });

    it("searchStringChanged should trigger an OData call", (done: MochaDone) => {

        const mockRepo = new Repository();

        const content = { Name: "TestGroup", Id: 1238756, Path: "Root/Example/TestGroup", Type: "Group" };
        const settings = {
            Compulsory: true,
            Name: "Members",
        } as ReferenceFieldSetting;
        viewModel.activate({ content, settings });
        viewModel.repository = mockRepo;
        viewModel.searchStringChanged("alma").then((r) => {
            expect(r.d.__count).to.be.eq(1);
            expect(r.d.results[0].Name).to.be.eq("alma");
            done();
        }, done);
    });

    it("FocusIn", () => {
        let isFocused = false;
        viewModel.searchInput = { focus: () => { isFocused = true; } } as any;
        viewModel.content = {Id: 123865, Path: "Root/Example", Name: "", Type: "User"};
        viewModel.isFocused = false;
        viewModel.isOpened = false;
        viewModel.focusIn();
        expect(viewModel.isFocused).to.be.eq(true);
        expect(viewModel.isOpened).to.be.eq(false);
        expect(isFocused).to.be.eq(true);

        viewModel.searchString = "asd";
        viewModel.focusIn();
        expect(viewModel.isOpened).to.be.eq(true);
    });

    it("FocusOut", () => {
        viewModel.controller = { validate: () => { /**/ } } as any;
        viewModel.settings = {
            Compulsory: true,
            Name: "Example",
        } as ReferenceFieldSetting;

        viewModel.isFocused = true;
        viewModel.isOpened = true;
        viewModel.focusOut();
        expect(viewModel.isFocused).to.be.eq(false);
        expect(viewModel.isOpened).to.be.eq(false);
    });

    it("PickValue", () => {
        const content: Group = { Type: "Group", Id: 12845, Path: "root/groups", Name: "Group1" };

        viewModel.content = content;
        viewModel.controller = { validate: () => { /** */ } } as any;
        viewModel.settings = {
            Compulsory: true,
            Name: "Members",
        } as ReferenceFieldSetting;

        const c1: User = { Id: 123, Path: "Root/Content1", Name: "Usr", Type: "User" };
        viewModel.items = [];

        viewModel.pickValue(c1);
        expect(viewModel.items[0]).to.be.eq(c1);
    });

    it("removeItem", () => {
        const content: Group = { Type: "Group", Id: 12845, Path: "root/groups", Name: "Group1" };

        viewModel.content = content;
        viewModel.controller = { validate: () => { /** */ } } as any;
        viewModel.settings = {
            Compulsory: true,
            Name: "Members",
        } as ReferenceFieldSetting;

        const c1: User = { Id: 123, Path: "Root/Content1", Name: "Usr", Type: "User" };
        viewModel.items = [c1];

        viewModel.removeReference(c1);
        expect(viewModel.items).to.be.deep.eq([]);
    });

});
