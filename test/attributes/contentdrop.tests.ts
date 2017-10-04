import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { Repository, Mocks } from 'sn-client-js';
import { ContentDropCustomAttribute } from '../../src/attributes';
import { MockDragEvent } from '../index';
import { DragTypes } from '../../src'


@suite('ContentDrop custom attribute')
export class ContentDropTests {

    private element: HTMLElement;
    private attribute: ContentDropCustomAttribute;

    private repo: Repository.BaseRepository;
    before() {
        this.repo = new Mocks.MockRepository();
        this.element = document.createElement('input');
        this.attribute = new ContentDropCustomAttribute(this.element);
    }

    @test
    public async 'Can be constructed'() {
        expect(this.attribute).to.be.instanceof(ContentDropCustomAttribute);
    }

    @test
    public async 'dragEnd should be handled'() {
        const ev = new MockDragEvent();
        this.attribute.dragEnd(ev);
        expect(ev.defaultPrevented).to.be.true;
        expect(ev.propagationStopped).to.be.true;
    }

    @test
    public async 'dragEnter should be handled'() {
        const ev = new MockDragEvent();
        this.attribute.dragEnter(ev);
        expect(ev.defaultPrevented).to.be.true;
        expect(ev.propagationStopped).to.be.true;
    }

    @test
    public async 'dragOver should be handled'() {
        const ev = new MockDragEvent();
        this.attribute.dragOver(ev);
        expect(ev.defaultPrevented).to.be.true;
        expect(ev.propagationStopped).to.be.true;
    }

    @test
    public 'dragDrop should be handled and single content should be received'(done: MochaDone) {
        const handler: ({ stringifiedContent, stringifiedContentList }: { stringifiedContent?: string, stringifiedContentList?: string[] }) => void =
            (content) => {
                expect(content.stringifiedContent).to.be.string;
                const parsedContent = content.stringifiedContent && this.repo.ParseContent(content.stringifiedContent);
                expect(parsedContent && parsedContent.Id).to.be.eq(123);
                done();
            };
        const ev = new MockDragEvent();
        ev.dataTransfer.setData(DragTypes.Content, this.repo.HandleLoadedContent({
            Id: 123,
            Path: 'Root/Example'
        }).Stringify());
        this.attribute.handler = handler;
        this.attribute.dragDrop(ev);
        expect(ev.defaultPrevented).to.be.true;
        expect(ev.propagationStopped).to.be.true;
    }

    @test
    public 'dragDrop should be handled and content list should be received'(done: MochaDone) {
        const handler: ({ stringifiedContent, stringifiedContentList }: { stringifiedContent?: string, stringifiedContentList?: string[] }) => void =
            (content) => {
                
                expect(content.stringifiedContentList).to.be.instanceOf(Array);
                const contentList = content.stringifiedContentList && content.stringifiedContentList.map(s => this.repo.ParseContent(s));

                expect(contentList).to.be.instanceof(Array);
                expect(contentList).to.be.length(2);

                expect(contentList && contentList[0].Id).to.be.eq(123);
                expect(contentList && contentList[1].Id).to.be.eq(321);
                done();
            };
        const ev = new MockDragEvent();
        ev.dataTransfer.setData(DragTypes.ContentList, JSON.stringify([
            this.repo.HandleLoadedContent({
                Id: 123,
                Path: 'Root/Example'
            }).Stringify(),
            this.repo.HandleLoadedContent({
                Id: 321,
                Path: 'Root/Example2'
            }).Stringify()
        ]));
        this.attribute.handler = handler;
        this.attribute.dragDrop(ev);
        expect(ev.defaultPrevented).to.be.true;
        expect(ev.propagationStopped).to.be.true;
    }

}