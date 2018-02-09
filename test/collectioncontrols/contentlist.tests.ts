import { IContent } from "@sensenet/client-core";
import { IDisposable } from "@sensenet/client-utils";
import { ContentLink } from "@sensenet/default-content-types";
import { Query } from "@sensenet/query";
import { ComponentTester } from "aurelia-testing";
import { expect } from "chai";
import { ContentList } from "../../src/collectioncontrols";
import { ComponentTestHelper } from "../component-test-helper";
import { MockDragEvent } from "../index";

export const contentListTests = describe("ContentList component", () => {
    const item1: IContent = {
        Id: 10001,
        Path: "Root/Item1",
        Name: "Item1",
        Type: "User",
    };

    const item2: IContent = {
        Id: 10002,
        Path: "Root/Item2",
        Name: "Item2",
        Type: "Task",
    };

    const item3: IContent = {
        Id: 10003,
        Path: "Root/Item3",
        Name: "Item3",
        Type: "Workspace",
    };

    const item4: IContent = {
        Id: 10004,
        Path: "Root/Item4",
        Name: "Item4",
        Type: "Site",
    };

    let viewModel: ContentList & IDisposable;

    beforeEach(async () => {
        viewModel = await ComponentTestHelper.createAndGetViewModel<ContentList>("<content-list></content-list>", "content-list");
    });

    afterEach(() => {
        viewModel.dispose();
    });

    it("Can be constructed", () => {
        expect(viewModel).to.be.instanceof(ContentList);
    });

    it("HasScope() should be false if there is no Scope bound", () => {
        expect(viewModel.hasScope).to.be.equals(false);
    });

    it("HasScope() should be true if there is a valid Scope bound", () => {
        const scopeContent = {
            Id: 123321,
            Path: "Root/Example",
            Name: "scope",
            Type: "User",
        };
        viewModel.scope = scopeContent;
        expect(viewModel.hasScope).to.be.equals(true);
    });

    it("activateItem() should trigger the OnActivate() callback", (done: MochaDone) => {
        const content = {
            Id: 123321,
            Path: "Root/Example",
            Name: "scope",
            Type: "User",
        };

        viewModel.onActivate = (arg) => {
            expect(arg.content).to.be.eq(content);
            done();
        };
        viewModel.activateItem(content);
    });

    it("clearSubscriptions() should unsubscribe from all Observables", (done: MochaDone) => {
        viewModel.reinitialize();
        viewModel.disposeObservers();
        // tslint:disable-next-line:no-string-literal
        expect(viewModel["observers"]).to.be.deep.eq([]);
        done();
    });

    it("selectItem() should return if selection is disabled", (done: MochaDone) => {
        const ev = new MockDragEvent();
        viewModel.enableSelection = false;
        viewModel.selectItem(ev as any, item1);
        expect(viewModel.selection).to.be.deep.eq([]);
        done();
    });

    it("selectItem() should select an item if there is no Multiselect enabled, even with ctrl / shift", (done: MochaDone) => {
        const ev = new MockDragEvent();
        viewModel.multiSelect = false;
        viewModel.items = [item1, item2, item3];
        viewModel.selectItem(ev as any, item1);
        expect(viewModel.isSelected(item1)).to.be.eq(true);
        expect(viewModel.isSelected(item2)).to.be.eq(false);
        expect(viewModel.isSelected(item3)).to.be.eq(false);

        ev.shiftKey = true;
        viewModel.selectItem(ev as any, item2);
        expect(viewModel.isSelected(item1)).to.be.eq(false);
        expect(viewModel.isSelected(item2)).to.be.eq(true);
        expect(viewModel.isSelected(item3)).to.be.eq(false);

        ev.ctrlKey = true;
        viewModel.selectItem(ev as any, item3);
        expect(viewModel.isSelected(item1)).to.be.eq(false);
        expect(viewModel.isSelected(item2)).to.be.eq(false);
        expect(viewModel.isSelected(item3)).to.be.eq(true);

        done();
    });

    it("selectItem() should select an item if Multiselect is enabled without ctrl / shift", () => {
        const ev = new MockDragEvent();
        viewModel.multiSelect = true;
        viewModel.items = [item1, item2, item3];

        viewModel.selectItem(ev as any, item1);
        expect(viewModel.isSelected(item1)).to.be.eq(true);
        expect(viewModel.isSelected(item2)).to.be.eq(false);
        expect(viewModel.isSelected(item3)).to.be.eq(false);

        viewModel.selectItem(ev as any, item2);
        expect(viewModel.isSelected(item1)).to.be.eq(false);
        expect(viewModel.isSelected(item2)).to.be.eq(true);
        expect(viewModel.isSelected(item3)).to.be.eq(false);

        viewModel.selectItem(ev as any, item3);
        expect(viewModel.isSelected(item1)).to.be.eq(false);
        expect(viewModel.isSelected(item2)).to.be.eq(false);
        expect(viewModel.isSelected(item3)).to.be.eq(true);
    });

    it("selectItem() with CTRL should toggle the item selection", () => {
        const ev = new MockDragEvent();
        ev.ctrlKey = true;
        viewModel.multiSelect = true;
        viewModel.items = [item1, item2, item3];

        viewModel.selectItem(ev as any, item1);
        expect(viewModel.isSelected(item1)).to.be.eq(true);
        expect(viewModel.isSelected(item2)).to.be.eq(false);
        expect(viewModel.isSelected(item3)).to.be.eq(false);

        viewModel.selectItem(ev as any, item1);
        expect(viewModel.isSelected(item1)).to.be.eq(false);
        expect(viewModel.isSelected(item2)).to.be.eq(false);
        expect(viewModel.isSelected(item3)).to.be.eq(false);

        viewModel.selectItem(ev as any, item1);
        viewModel.selectItem(ev as any, item3);
        expect(viewModel.isSelected(item1)).to.be.eq(true);
        expect(viewModel.isSelected(item2)).to.be.eq(false);
        expect(viewModel.isSelected(item3)).to.be.eq(true);
    });

    it("selectItem() with SHIFT should select an item range", () => {
        const ev = new MockDragEvent();
        viewModel.multiSelect = true;
        viewModel.items = [item1, item2, item3, item4];

        viewModel.selectItem(ev as any, item1);
        expect(viewModel.isSelected(item1)).to.be.eq(true);
        expect(viewModel.isSelected(item2)).to.be.eq(false);
        expect(viewModel.isSelected(item3)).to.be.eq(false);
        expect(viewModel.isSelected(item4)).to.be.eq(false);

        ev.shiftKey = true;
        viewModel.selectItem(ev as any, item3);
        expect(viewModel.isSelected(item1)).to.be.eq(true);
        expect(viewModel.isSelected(item2)).to.be.eq(true);
        expect(viewModel.isSelected(item3)).to.be.eq(true);
        expect(viewModel.isSelected(item4)).to.be.eq(false);

        ev.shiftKey = false;
        viewModel.selectItem(ev as any, item4);
        expect(viewModel.isSelected(item1)).to.be.eq(false);
        expect(viewModel.isSelected(item2)).to.be.eq(false);
        expect(viewModel.isSelected(item3)).to.be.eq(false);
        expect(viewModel.isSelected(item4)).to.be.eq(true);

        ev.shiftKey = true;
        viewModel.selectItem(ev as any, item2);
        expect(viewModel.isSelected(item1)).to.be.eq(false);
        expect(viewModel.isSelected(item2)).to.be.eq(true);
        expect(viewModel.isSelected(item3)).to.be.eq(true);
        expect(viewModel.isSelected(item4)).to.be.eq(true);
    });

    it("toggleSelection() should select simple items if multiselect is disabled", () => {
        const ev = new MockDragEvent();
        viewModel.multiSelect = false;
        viewModel.items = [item1, item2, item3];

        viewModel.toggleSelection(ev as any, item1);
        expect(viewModel.isSelected(item1)).to.be.eq(true);
        expect(viewModel.isSelected(item2)).to.be.eq(false);
        expect(viewModel.isSelected(item3)).to.be.eq(false);

        viewModel.toggleSelection(ev as any, item2);
        expect(viewModel.isSelected(item1)).to.be.eq(false);
        expect(viewModel.isSelected(item2)).to.be.eq(true);
        expect(viewModel.isSelected(item3)).to.be.eq(false);

        viewModel.toggleSelection(ev as any, item3);
        expect(viewModel.isSelected(item1)).to.be.eq(false);
        expect(viewModel.isSelected(item2)).to.be.eq(false);
        expect(viewModel.isSelected(item3)).to.be.eq(true);
    });

    it("Reinitialize() should return, if triggered twice while loading", () => {
        viewModel.query = new Query((q) => q.equals("DisplayName", "Example"));
        viewModel.getItems = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve(), 10);
            });
        };
        viewModel.reinitialize();
        viewModel.reinitialize();
    });

    it("ReloadOnContentChange() should return true", () => {
        expect(viewModel.reloadOnContentChange(null as any)).to.be.eq(true);
    });

    it("handleContentChanges() should trigger a reinitialize", () => {
        viewModel.getItems = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve(), 100);
            });
        };
        viewModel.handleContentChanges({ Id: 123, Path: "Root/Example/Folder1", Name: "aaa", Type: "User" });
        expect(viewModel.isLoading).to.be.eq(true);
    });

    it("dropContent() should trigger OnDropContent if the Content is in the scope", (done: MochaDone) => {
        viewModel.scope = item4;
        viewModel.onDropContent = (ev) => {
            expect(ev.content).to.be.deep.eq(item1);
            done();
        };
        viewModel.dropContent(null as any, JSON.stringify(item1));
    });

    it("dropContent() should trigger OnDropContentList for multiple content if the Content is in the scope", (done: MochaDone) => {
        viewModel.scope = item4;
        viewModel.onDropContentList = (ev) => {
            expect(ev.contentList[0]).to.be.deep.eq(item1);
            expect(ev.contentList[1]).to.be.deep.eq(item2);
            done();
        };
        viewModel.dropContent(null as any, null as any, [JSON.stringify(item1), JSON.stringify(item2)]);
    });

    it("dropContent() should trigger OnDropFiles for files", (done: MochaDone) => {
        const fileList = {};
        viewModel.scope = item4;
        viewModel.onDropFiles = (ev) => {
            // ToDo
            // expect(ev.files).to.be.deep.eq(fileList);
            done();
        };
        viewModel.dropContent(null as any, null as any, null as any, fileList as any);
    });

    it("dropContentOnItem() should trigger OnDropContent if the Content is in the scope", (done: MochaDone) => {
        viewModel.scope = item4;
        viewModel.onDropContentOnItem = (ev) => {
            expect(ev.content).to.be.deep.eq(item1);
            done();
        };
        viewModel.dropContentOnItem(null as any, item3, JSON.stringify(item1));
    });

    it("dropContentOnItem() should trigger OnDropContentList for multiple content if the Content is in the scope", (done: MochaDone) => {
        viewModel.scope = item4;
        viewModel.onDropContentListOnItem = (ev) => {
            expect(ev.contentList[0]).to.be.deep.eq(item1);
            expect(ev.contentList[1]).to.be.deep.eq(item2);
            done();
        };
        viewModel.dropContentOnItem(null as any, item3, null as any, [JSON.stringify(item1), JSON.stringify(item2)]);
    });

    it("dropContentOnItem() should trigger OnDropFiles for files", (done: MochaDone) => {
        const fileList = {};
        viewModel.scope = item4;
        viewModel.onDropFilesOnItem = (ev) => {
            // ToDo
            // expect(ev.files).to.be.eq(fileList);
            done();
        };
        viewModel.dropContentOnItem(null as any, item3, null as any, null as any, fileList as any);
    });
});
