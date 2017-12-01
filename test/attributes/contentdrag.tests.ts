import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { Repository, Mocks, ContentInternal } from 'sn-client-js';
import { ContentDragCustomAttribute } from '../../src/attributes';
import { DragTypes } from '../../src/Enums';
import { MockDragEvent } from '../mocks';


@suite('ContentDrag custom attribute')
export class ContentDragTests {

    private element: HTMLElement;
    private attribute: ContentDragCustomAttribute;

    private repo: Repository.BaseRepository;
    before() {
        this.repo = new Mocks.MockRepository();
        this.element = document.createElement('input');
        this.attribute = new ContentDragCustomAttribute(this.element);
    }

    @test
    public async 'Can be constructed'() {
        expect(this.attribute).to.be.instanceof(ContentDragCustomAttribute);
    }

    @test
    public async 'Content can be bound'() {
        this.attribute.content = [this.repo.HandleLoadedContent({
            Id: 123456,
            Path: '/Root/Example',
            Name: 'C1'
        })];
        expect(this.attribute.content[0]).to.be.instanceof(ContentInternal);
    }

    @test
    public async 'dragStart event is bound and simple content dragged'() {
        this.attribute.content = [this.repo.HandleLoadedContent({
            Id: 123456,
            Path: '/Root/Example',
            Name: 'C2'
        })];
        const ev = new MockDragEvent();
        ev.type = 'dragstart';
        const handeld = this.attribute.dragStart(ev);
        expect(handeld).to.be.true;
        const dragged = ev.dataTransfer.getData(DragTypes.Content)
        const parsed = this.repo.ParseContent(dragged);
        expect(parsed.Id).to.be.eq(this.attribute.content[0].Id);
    }


    @test
    public async 'dragStart event is bound and multiple content dragged'() {
        this.attribute.content = [
            this.repo.HandleLoadedContent({
                Id: 123456,
                Path: '/Root/Example',
                Name: 'C1'
            }),
            this.repo.HandleLoadedContent({
                Id: 654321,
                Path: '/Root/Example2',
                Name: 'C2'
            })];
        const ev = new MockDragEvent();
        ev.type = 'dragstart';
        const handeld = this.attribute.dragStart(ev);
        expect(handeld).to.be.true;


        const serializedContentList = JSON.parse(ev.dataTransfer.getData(DragTypes.ContentList)).map(c => this.repo.ParseContent(c));
        expect(serializedContentList[0].Id).to.be.eq(this.attribute.content[0].Id);
        expect(serializedContentList[1].Id).to.be.eq(this.attribute.content[1].Id);
    }
}