import { IODataCollectionResponse, Repository } from "@sensenet/client-core";
import { IDisposable } from "@sensenet/client-utils";
import { ReferenceFieldSetting, User } from "@sensenet/default-content-types";
import { expect } from "chai";
import { ContentReference } from "../../src/fieldcontrols";
import { ComponentTestHelper } from "../component-test-helper";

export const contentReferenceFieldTests = describe("ContentReferenceField component", () => {
    const createFieldViewModel = () => ComponentTestHelper.createAndGetViewModel<ContentReference>("<content-reference></content-reference>", "content-reference");

    let viewModel: ContentReference & IDisposable;

    beforeEach(async () => {
        viewModel = await createFieldViewModel();
    });

    afterEach(() => {
        viewModel.dispose();
    });

    it("Can be constructed", async () => {
        expect(viewModel).to.be.instanceof(ContentReference);
    });

    it("Can not be modified if is read only", () => {
        viewModel.settings = {
            ReadOnly: true,
        } as ReferenceFieldSetting;
        const content = {Id: 123765, Path: "Root/Example", Name: "ExampleContent", Type: "User"};
        const contentViewElement = document.querySelector("content-reference .search-box");
        expect(contentViewElement).to.be.eq(null);
    });

    it("Required rule is added if complusory", () => {
        const content = {Id: 123765, Path: "Root/Example", Name: "ExampleContent", Type: "User"};
        const settings = {
            Compulsory: true,
            Name: "Example",
        } as ReferenceFieldSetting;
        viewModel.activate({ content, settings });
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq("required");
    });

    it("searchStringChanged should trigger an OData call", (done: MochaDone) => {
            const content = { Name: "TestContent", Path: "Root/Example/Test", Id: 817235, Type: "User" };
            const settings = {
                Compulsory: true,
                Name: "CreatedBy",
            } as ReferenceFieldSetting;

             // tslint:disable-next-line:no-string-literal
            viewModel.repository["fetch"] = async (...args: any[]) => {
                return {
                    ok: true,
                    json: async () => ({
                        d: {
                            __count: 1,
                            results: [{
                                Id: 4,
                                Path: "Asdasdasd",
                                Name: "alma",
                                Type: "User",
                            }],
                        },
                    } as IODataCollectionResponse<User>),
                } as any;
            };

            viewModel.activate({ content, settings }).then(() => {

                setTimeout(() => {
                    viewModel.searchStringChanged("alma").then((r) => {
                        expect(r.d.__count).to.be.eq(1);
                        expect(r.d.results[0].Name).to.be.eq("alma");
                        done();
                    }, done);

                }, 200);

            }, done);
    });

    it("PickValue", (done: MochaDone) => {

        const mockRepo = new Repository({}, async (...args) => ({} as any));

        const content = { Id: 123, Path: "Root/Content1", Name: "C0", Type: "" };
        const c1 = { Id: 123, Path: "Root/Content1", Name: "C1", Type: "" };
        const c2 = { Id: 12356, Path: "Root/Content1", Name: "C1", Type: "" };
        const settings = {
                Compulsory: true,
                Name: "CreatedBy",
            } as ReferenceFieldSetting;
        viewModel.activate({ content, settings, controller: { validate: () => { /** */ } } });
        viewModel.searchString = "asd";
        viewModel.isOpened = true;

        // ToDo
        // viewModel.value.setContent(c1);
        viewModel.pickValue(c2);
        expect(viewModel.searchString).to.be.eq("");
        expect(viewModel.isOpened).to.be.eq(false);

            // ToDo
            // expect(viewModel.value._contentReference).to.be.eq(c2);
        done();
    });

    it("FocusIn", () => {
        let isFocused = false;
        viewModel.searchInput = { focus: () => { isFocused = true; } } as any;
        viewModel.content = {Id: 123, Path: "Root/Content1", Name: "C1", Type: "User"};
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
        viewModel.controller = { validate: () => { /** */ } } as any;
        viewModel.content = {Id: 123, Path: "Root/Content1", Name: "C1", Type: "User"};
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

    it("removeItem", () => {
        const content = { Id: 123, Path: "Root/Content1", Name: "C1", Type: "User" };

        viewModel.content = content;
        viewModel.controller = { validate: () => { /** */ } } as any;
        viewModel.settings = {
            Compulsory: true,
            Name: "CreatedBy",
        } as ReferenceFieldSetting;

        const c1 = { Id: 123, Path: "Root/Content1", Name: "C1", Type: "User" };
        viewModel.item = c1;

        viewModel.removeItem();
        expect(viewModel.item).to.be.eq(null);
        // ToDo
        // expect(viewModel.value._contentReference).to.be.eq(null);
    });
});
