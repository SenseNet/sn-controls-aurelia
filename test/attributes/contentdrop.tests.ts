import { expect } from "chai";
import { DragTypes } from "../../src";
import { ContentDropCustomAttribute } from "../../src/attributes";
import { MockDragEvent } from "../index";

export const contentDropTests = describe("Content Drop tests", () => {
    let element: HTMLElement;
    let attribute: ContentDropCustomAttribute;

    beforeEach(() => {
        element = document.createElement("input");
        attribute = new ContentDropCustomAttribute(element);
    });

    it("Can be constructed", () => {
        expect(attribute).to.be.instanceof(ContentDropCustomAttribute);
    });

    it("dragEnd should be handled", () => {
        const ev = new MockDragEvent();
        attribute.dragEnd(ev);
        expect(ev.defaultPrevented).to.be.eq(true);
        expect(ev.propagationStopped).to.be.eq(true);
    });

    it("dragEnter should be handled", () => {
        const ev = new MockDragEvent();
        attribute.dragEnter(ev);
        expect(ev.defaultPrevented).to.be.eq(true);
        expect(ev.propagationStopped).to.be.eq(true);
    });

    it("dragOver should be handled", () => {
        const ev = new MockDragEvent();
        attribute.dragOver(ev);
        expect(ev.defaultPrevented).to.be.eq(true);
        expect(ev.propagationStopped).to.be.eq(true);
    });

    it("dragDrop should be handled and single content should be received", (done: MochaDone) => {
        const handler: ({ stringifiedContent, stringifiedContentList }: { stringifiedContent?: string, stringifiedContentList?: string[] }) => void =
            (content) => {
                expect(typeof content.stringifiedContent).to.be.eq("string");
                const parsedContent = content.stringifiedContent && JSON.parse(content.stringifiedContent);
                expect(parsedContent && parsedContent.Id).to.be.eq(123);
                done();
            };
        const ev = new MockDragEvent();
        ev.dataTransfer.setData(DragTypes.Content, JSON.stringify({
            Id: 123,
            Path: "Root/Example",
            Name: "C1",
        }));
        attribute.handler = handler;
        attribute.dragDrop(ev);
        expect(ev.defaultPrevented).to.be.eq(true);
        expect(ev.propagationStopped).to.be.eq(true);
    });

    it("dragDrop should be handled and content list should be received", (done: MochaDone) => {
        const handler: ({ stringifiedContent, stringifiedContentList }: { stringifiedContent?: string, stringifiedContentList?: string[] }) => void =
            (content) => {

                expect(content.stringifiedContentList).to.be.instanceOf(Array);
                const contentList = content.stringifiedContentList && content.stringifiedContentList.map((s) => JSON.parse(s));

                expect(contentList).to.be.instanceof(Array);
                expect(contentList).to.be.length(2);

                expect(contentList && contentList[0].Id).to.be.eq(123);
                expect(contentList && contentList[1].Id).to.be.eq(321);
                done();
            };
        const ev = new MockDragEvent();
        ev.dataTransfer.setData(DragTypes.ContentList, JSON.stringify([
            JSON.stringify({
                Id: 123,
                Path: "Root/Example",
                Name: "C1",
            }),
            JSON.stringify({
                Id: 321,
                Path: "Root/Example2",
                Name: "C2",
            }),
        ]));
        attribute.handler = handler;
        attribute.dragDrop(ev);
        expect(ev.defaultPrevented).to.be.eq(true);
        expect(ev.propagationStopped).to.be.eq(true);
    });
});
