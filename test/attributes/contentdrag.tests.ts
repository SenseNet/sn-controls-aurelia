import { IContent } from "@sensenet/client-core";
import { expect } from "chai";
import { ContentDragCustomAttribute } from "../../src/attributes";
import { DragTypes } from "../../src/Enums";
import { MockDragEvent } from "../mocks";

export const contentDragTests = describe("ContentDrag custom attribute", () => {
    let element: HTMLElement;
    let attribute: ContentDragCustomAttribute;

    beforeEach(() => {
        element = document.createElement("input");
        attribute = new ContentDragCustomAttribute(element);
    });

    it("Can be constructed", () => {
        expect(attribute).to.be.instanceof(ContentDragCustomAttribute);
    });

    it("Content can be bound", () => {
        const content: IContent = {
            Id: 123456,
            Path: "/Root/Example",
            Name: "C1",
            Type: "User",
        };
        attribute.content = [content];
        expect(attribute.content[0]).to.be.eq(content);
    });

    it("dragStart event is bound and simple content dragged", () => {
        attribute.content = [{
            Id: 123456,
            Path: "/Root/Example",
            Name: "C2",
            Type: "User",
        }];
        const ev = new MockDragEvent();
        ev.type = "dragstart";
        const handeld = attribute.dragStart(ev);
        expect(handeld).to.be.eq(true);
        const dragged = ev.dataTransfer.getData(DragTypes.Content);
        const parsed = JSON.parse(dragged);
        expect(parsed.Id).to.be.eq(attribute.content[0].Id);
    });

    it("dragStart event is bound and multiple content dragged", () => {
        attribute.content = [
            {
                Id: 123456,
                Path: "/Root/Example",
                Name: "C1",
                Type: "User",
            },
            {
                Id: 654321,
                Path: "/Root/Example2",
                Name: "C2",
                Type: "Task",
            }];
        const ev = new MockDragEvent();
        ev.type = "dragstart";
        const handeld = attribute.dragStart(ev);
        expect(handeld).to.be.eq(true);

        const serializedContentList = JSON.parse(ev.dataTransfer.getData(DragTypes.ContentList)).map((c) => JSON.parse(c));
        expect(serializedContentList[0].Id).to.be.eq(attribute.content[0].Id);
        expect(serializedContentList[1].Id).to.be.eq(attribute.content[1].Id);
    });

});
