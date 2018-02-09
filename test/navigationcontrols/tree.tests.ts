import { IContent, Repository } from "@sensenet/client-core";
import { IODataCollectionResponse } from "@sensenet/client-core";
import { IODataBatchResponse } from "@sensenet/client-core/dist/Models/IODataBatchResponse";
import { IDisposable, PathHelper } from "@sensenet/client-utils";
import { GenericContent } from "@sensenet/default-content-types";
import { EventHub } from "@sensenet/repository-events";
import { expect } from "chai";
import { Tree } from "../../src/navigationcontrols";
import { ComponentTestHelper } from "../component-test-helper";

export const treeTests = describe("Tree component", () => {
    let eventHub: EventHub;
    let viewModel: Tree & IDisposable;

    beforeEach(async () => {
        viewModel = await createAndGetViewModel();
        eventHub = new EventHub(viewModel.repository);

    });

    afterEach(() => {
        viewModel.disposeObservers();
        viewModel.dispose();
    });

    const createAndGetViewModel = () =>  ComponentTestHelper.createAndGetViewModel<Tree>("<tree></tree>", "tree" );

    const setupResponse = (resp: any) => {
        // tslint:disable-next-line:no-string-literal
        viewModel.repository["fetchMethod"] = async (...args: any[]) => {
            return {
                ok: true,
                json: async () => {
                    return resp;
                },
            } as any;
        };
    };

    const setupError = (err?: any) => {
        // tslint:disable-next-line:no-string-literal
        (global as any).window.fetch = async (...args: any[]) => ({
            ok: false,
            json: async () => err,
        } as any);
    };

    it( "Can be constructed", async () => {
        expect(viewModel).to.be.instanceof(Tree);
    });

    it("IsSelected should check Selection and Content by path", async () => {
        const testContent = { Path: "example/path", Name: "", Id: 2138475, Type: "Task" };
        const testContent2 = { Path: "another/example/path", Name: "", Id: 2198475, Type: "Task"  };

        viewModel.content = testContent;
        viewModel.selection = testContent2;

        expect(viewModel.isSelected).to.be.eq(false);

        viewModel.selection = testContent;
        expect(viewModel.isSelected).to.be.eq(true);
    });

    it("IsSelected should return a valid value when no Selection is provided", async () => {
        const testContent = { Path: "example/path", Name: "", Id: 654, Type: "Task" };
        viewModel.content = testContent;
        viewModel.selection = null as any;
        expect(viewModel.isSelected).to.be.eq(false);
    });

    it("Expand() should be triggered if selection is below the actual Content", async () => {
        const testContent: IContent = { Path: "example/path", Type: "Task", Name: "Ex1", Id:  1242365 };
        const testContent2: IContent = { Path: "example/path/child", Type: "Task", Name: "T2", Id: 2358976};

        viewModel.content = testContent;
        viewModel.selection = testContent2;

        expect(viewModel.isSelected).to.be.eq(false);
        expect(viewModel.isExpanded).to.be.eq(true);
        expect(viewModel.isLoading).to.be.eq(true);
    });

    it("hasChildren should be set based on the Children count", async () => {
        const testContent: IContent = { Path: "example/path", Name: "test", Id: 1234875, Type: "Task" };
        viewModel.content = testContent;
        viewModel.select();
        setupResponse({
            d: {
                __count: 0,
                results: [],
            },
        } as IODataCollectionResponse<IContent>);

        await viewModel.expand();
        expect(viewModel.hasChildren).to.be.eq(false);

        viewModel.toggle();

        setupResponse({
            d: {
                __count: 0,
                results: [
                    { Id: 1, Name: "TestContent", DisplayName: "TestContent" },
                ],
            },
        } as IODataCollectionResponse<GenericContent>);

        await viewModel.expand();
        expect(viewModel.hasChildren).to.be.eq(true);
    });

    it("Should handle Load error", async () => {
        viewModel.content = { Path: "example/path", Id: 5467, Name: "example", Type: "Task" };
        setupError({ message: "Whoooops" });
        try {
            await viewModel.expand();
            throw new Error("Should have an error...");
        } catch (error) {
            expect(viewModel.isLoading).to.be.eq(false);
        }
    });

    it("ContentChanged should handle change to a non-valid content", async () => {
        viewModel.content = { Path: "example/path", Id: 5467, Name: "example", Type: "Task" };
        viewModel.contentChanged();
    });

    it("ContentChanged should handle change to a valid content", async () => {
        viewModel.content = { Id: 1, Path: "example/path", DisplayName: "example", Name: "Example", Type: "Task" } as GenericContent;
        viewModel.contentChanged();
    });

    it("OnContentCreated should append a child",  async () => {
        viewModel.content = { Id: 464572, Path: "example/path", DisplayName: "example", Name: "Example", Type: "Task" } as GenericContent;
        viewModel.isExpanded = true;
        const child = { Id: 1242623, Path: "example/path/child", DisplayName: "example2", Name: "Exampl2e", Type: "Task" } as GenericContent;
        viewModel.handleContentCreated({content: child});
        expect(viewModel.children[0]).to.be.eq(child);
    });

    it("OnContentDeleted should remove a Child", async () => {
        viewModel.content = { Id: 464572, Path: "example/path", DisplayName: "example", Name: "Example", Type: "Task" } as GenericContent;
        viewModel.isExpanded = true;
        const child = { Id: 1242623, Path: "example/path/child", DisplayName: "example2", Name: "Exampl2e", Type: "Task" } as GenericContent;
        viewModel.children = [child];
        viewModel.handleContentDeleted({contentData: child, permanently: true});
        expect(viewModel.children.filter((c) => c && c.Id === child.Id).length).to.be.eq(0);
    });

    it("OnContentModified should reorder children if a modified Content is a Child", async () => {
        viewModel.content = { Id: 464572, Path: "example/path", DisplayName: "example", Name: "Example", Type: "Task" } as GenericContent;
        viewModel.isExpanded = true;
        const child = { Id: 1242623, Path: "example/path/child", DisplayName: "example2", Name: "Exampl2e", Type: "Task" } as GenericContent;
        viewModel.children = [child];
        viewModel.handleContentModified({content: child} as any);
    });

    it("OnContentMoved should continue if the moved Content has nothing to do with the current Tree level", async () => {
        viewModel.content = { Id: 464572, Path: "example/path", DisplayName: "example", Name: "Example", Type: "Task" } as GenericContent;
        viewModel.isExpanded = true;
        const child = { Id: 1242623, Path: "example/path/child", DisplayName: "example2", Name: "Exampl2e", Type: "Task" } as GenericContent;
        try {
        await viewModel.handleContentMoved({content: child});
        } catch { /** */ }
        expect(viewModel.children.filter((c) => c && c.Id === child.Id).length).to.be.eq(0);
    });

    it("OnContentMoved should remove child, if it was moved out", async () => {
        viewModel.content = { Id: 464572, Path: "example/path", DisplayName: "example", Name: "Example", Type: "Task" } as GenericContent;
        viewModel.isExpanded = true;
        const child = { Id: 1242623, Path: "example/path/child", DisplayName: "example2", Name: "Exampl2e", Type: "Task" } as GenericContent;
        viewModel.children = [child];
        viewModel.handleContentMoved({content: child});
        expect(viewModel.children.filter((c) => c && c.Id === child.Id).length).to.be.eq(0);
    });

    it("OnContentMoved should start to reload a child if it was moved in", async () => {
        viewModel.content = { Id: 464572, Path: "example/path", DisplayName: "example", Name: "Example", Type: "Task" } as GenericContent;
        viewModel.isExpanded = true;
        const child = { Id: 1242623, Path: "example/path/child", DisplayName: "example2", Name: "Exampl2e", Type: "Task" } as GenericContent;
        const moveReq = viewModel.handleContentMoved({content: child});
        expect(viewModel.isLoading).to.be.eq(true);

        try {
            await moveReq;
        } catch  {
            /** ignore */
        }
    });

    it("OnContentMoved should remove isLoading on success", (done) => {

        viewModel.content = { Id: 464572, Path: "example/path", DisplayName: "example", Name: "Example", Type: "Task" } as GenericContent;
        setupResponse({
            d: viewModel.content,
        });
        viewModel.isExpanded = true;
        const child = { Id: 1242623, Path: "example/path/child", DisplayName: "example2", Name: "Exampl2e", Type: "Task" } as GenericContent;
        viewModel.handleContentMoved({content: child}).then((content) => {
            expect(viewModel.isLoading).to.be.eq(false);
            done();
        }, (err) => done);
    });

    it("OnContentMoved should remove isLoading on failure", async () => {
        viewModel.content = { Id: 464572, Path: "example/path", DisplayName: "example", Name: "Example", Type: "Task" } as GenericContent;
        const dropped = { Id: 1242623, Path: "example/path/child", DisplayName: "example2", Name: "Exampl2e", Type: "Task" } as GenericContent;
        setupResponse({
            d: {
                __count: 1,
                errors: [{content: dropped, error: "error"}],
                results: [],
            },
        } as IODataBatchResponse<IContent>);
        viewModel.isExpanded = true;
        const moveReq = viewModel.dropContent(null as any, JSON.stringify({Id: 1242623, Path: "Other/Example", Name: "example2"}));
        expect(viewModel.isLoading).to.be.eq(true);
        try {
            await moveReq;
        } catch (error) {
            /**  */

        }
        expect(viewModel.isLoading).to.be.eq(false);
    });

    it("dropContent should add a child, if a dropped content can be moved below IsLoading on failure", (done: MochaDone) => {
        viewModel.content =  { Id: 464572, Path: "example/path", DisplayName: "example", Name: "Example", Type: "Task" } as GenericContent;
        setupError({
            message: ":(",
        });
        viewModel.isExpanded = true;
        const child = { Id: 1242623, Path: "example/path/child", DisplayName: "example2", Name: "Exampl2e", Type: "Task" } as GenericContent;
        viewModel.handleContentMoved({content: child}).then((content) => {
            done("This should have failed");
        }, (err) => done());
    });

});
