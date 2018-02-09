import { expect } from "chai";
import { ContentList } from "../../src/index";
import { ControlNameResolverService } from "../../src/services";

export const contentNameResolverServiceTests = describe("ControlNameResolverService Tests", () => {
    let controlNameResolverService: ControlNameResolverService;

    beforeEach(() => {
        controlNameResolverService = new ControlNameResolverService();
    });

    it("ControlNameResolver should return Null if control is null", () => {
        const name = controlNameResolverService.getNameForControl(null as any);
        expect(name).to.be.eq(null);
    });

    it("ControlNameResolver should return Null if control doesn't have a name", () => {
        const name = controlNameResolverService.getNameForControl({} as any);
        expect(name).to.be.eq(null);
    });

    it("ControlNameResolver should return Null if control name is empty", () => {
        const name = controlNameResolverService.getNameForControl({ name: "" } as any);
        expect(name).to.be.eq(null);
    });

    it("ControlNameResolver should return correct module name if found by object reference", () => {
        const name = controlNameResolverService.getNameForControl(ContentList, (callback) => {
            callback("example-module-path/Module1", {Module: true});
            callback("example-module-path/ContentList", {ContentList});
        });
        expect(name).to.be.eq("example-module-path/ContentList");
    });

    it("ControlNameResolver should return correct module name if found by object name (fallback)", () => {
        const name = controlNameResolverService.getNameForControl({name: "ContentList"}, (callback) => {
            callback("example-module-path/Module1", {Module: true});
            callback("example-module-path/ContentList", {ContentList});
        });
        expect(name).to.be.eq("example-module-path/ContentList");
    });
});
