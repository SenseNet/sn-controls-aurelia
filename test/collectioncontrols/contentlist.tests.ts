import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ComponentTestBase } from '../component-test.base';
import { ContentList } from '../../src/collectioncontrols';
import { MockDragEvent } from '../index';
import { Authentication } from 'sn-client-js';

@suite('ContentList component')
export class ContentListTests extends ComponentTestBase<ContentList> {

    constructor() {
        super();
    }

    private item1 = this.mockRepo.HandleLoadedContent({
        Id: 10001,
        Path: 'Root/Item1',
        Name: 'Item1'
    })

    private item2 = this.mockRepo.HandleLoadedContent({
        Id: 10002,
        Path: 'Root/Item2',
        Name: 'Item2'
    })

    private item3 = this.mockRepo.HandleLoadedContent({
        Id: 10003,
        Path: 'Root/Item3',
        Name: 'Item3'
    })

    private item4 = this.mockRepo.HandleLoadedContent({
        Id: 10004,
        Path: 'Root/Item4',
        Name: 'Item4'
    })    

    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createAndGetViewModel('<content-list></content-list>', 'content-list');
        expect(viewModel).to.be.instanceof(ContentList);
    }


    @test
    public async 'HasScope() should be false if there is no Scope bound'() {
        const viewModel = await this.createAndGetViewModel('<content-list></content-list>', 'content-list');
        expect(viewModel.hasScope).to.be.equals(false);
    }

    @test
    public async 'HasScope() should be true if there is a valid Scope bound'() {
        const viewModel = await this.createAndGetViewModel('<content-list></content-list>', 'content-list');
        const scopeContent = this.mockRepo.HandleLoadedContent({
            Id: 123321,
            Path: 'Root/Example',
            Name: 'scope'
        });
        viewModel.Scope = scopeContent;
        expect(viewModel.hasScope).to.be.equals(true);
    }


    @test
    public async 'Repository() should return the Repository from a Scope content'() {
        const viewModel = await this.createAndGetViewModel('<content-list></content-list>', 'content-list');
        const scopeContent = this.mockRepo.HandleLoadedContent({
            Id: 123321,
            Path: 'Root/Example',
            Name: 'scope'
        });
        viewModel.Scope = scopeContent;
        expect(viewModel.Repository).to.be.equals(scopeContent.GetRepository());
    }

    @test
    public 'activateItem() should trigger the OnActivate() callback'(done: MochaDone) {
        this.createAndGetViewModel('<content-list></content-list>', 'content-list').then((viewModel) => {
            const content = this.mockRepo.HandleLoadedContent({
                Id: 123321,
                Path: 'Root/Example',
                Name: 'scope'
            });

            viewModel.OnActivate = (arg) => {
                expect(arg.content).to.be.eq(content);
                done();
            }
            viewModel.activateItem(content)
        });
    }

    @test
    public 'clearSubscriptions() should unsubscribe from all Observables'(done: MochaDone) {
        this.createAndGetViewModel('<content-list></content-list>', 'content-list').then((viewModel) => {
            viewModel.Reinitialize();
            viewModel.clearSubscriptions();
            expect(viewModel['Subscriptions']).to.be.empty;
            done();
        })
    }

    @test
    public 'triggerAction() should trigger the selected action'(done: MochaDone) {
        this.createAndGetViewModel('<content-list></content-list>', 'content-list').then((viewModel) => {
            const ev = new MockDragEvent();
            viewModel.triggerAction(ev as any, (item) => {
                expect(ev.propagationStopped).to.be.true;
                expect(item.Id).to.be.eq(123);
                done();
            }, this.mockRepo.HandleLoadedContent({
                Id: 123,
                Path: 'root'
            }));
        })
    }

    @test
    public 'selectItem() should return if selection is disabled'(done: MochaDone) {
        this.createAndGetViewModel('<content-list></content-list>', 'content-list').then((viewModel) => {
            const ev = new MockDragEvent();
            viewModel.EnableSelection = false;
            viewModel.selectItem(ev as any, this.item1);
            expect(viewModel.Selection).to.be.empty;
            done();
        })
    }

    @test
    public 'selectItem() should select an item if there is no Multiselect enabled, even with ctrl / shift'(done: MochaDone) {
        this.createAndGetViewModel('<content-list></content-list>', 'content-list').then((viewModel) => {
            const ev = new MockDragEvent();
            viewModel.MultiSelect = false;
            viewModel.Items = [this.item1, this.item2, this.item3];
            viewModel.selectItem(ev as any, this.item1);
            expect(viewModel.isSelected(this.item1)).to.be.true;
            expect(viewModel.isSelected(this.item2)).to.be.false;
            expect(viewModel.isSelected(this.item3)).to.be.false;

            ev.shiftKey = true;
            viewModel.selectItem(ev as any, this.item2);
            expect(viewModel.isSelected(this.item1)).to.be.false;
            expect(viewModel.isSelected(this.item2)).to.be.true;
            expect(viewModel.isSelected(this.item3)).to.be.false;

            ev.ctrlKey = true;
            viewModel.selectItem(ev as any, this.item3);
            expect(viewModel.isSelected(this.item1)).to.be.false;
            expect(viewModel.isSelected(this.item2)).to.be.false;
            expect(viewModel.isSelected(this.item3)).to.be.true;

            done();
        })
    }

    @test
    public 'selectItem() should select an item if Multiselect is enabled without ctrl / shift'(done: MochaDone) {
        this.createAndGetViewModel('<content-list></content-list>', 'content-list').then((viewModel) => {
            const ev = new MockDragEvent();
            viewModel.MultiSelect = true;
            viewModel.Items = [this.item1, this.item2, this.item3];

            viewModel.selectItem(ev as any, this.item1);
            expect(viewModel.isSelected(this.item1)).to.be.true;
            expect(viewModel.isSelected(this.item2)).to.be.false;
            expect(viewModel.isSelected(this.item3)).to.be.false;

            viewModel.selectItem(ev as any, this.item2);
            expect(viewModel.isSelected(this.item1)).to.be.false;
            expect(viewModel.isSelected(this.item2)).to.be.true;
            expect(viewModel.isSelected(this.item3)).to.be.false;

            viewModel.selectItem(ev as any, this.item3);
            expect(viewModel.isSelected(this.item1)).to.be.false;
            expect(viewModel.isSelected(this.item2)).to.be.false;
            expect(viewModel.isSelected(this.item3)).to.be.true;

            done();
        })
    }

    @test
    public 'selectItem() with CTRL should toggle the item selection'(done: MochaDone) {
        this.createAndGetViewModel('<content-list></content-list>', 'content-list').then((viewModel) => {
            const ev = new MockDragEvent();
            ev.ctrlKey = true;
            viewModel.MultiSelect = true;
            viewModel.Items = [this.item1, this.item2, this.item3];

            viewModel.selectItem(ev as any, this.item1);
            expect(viewModel.isSelected(this.item1)).to.be.true;
            expect(viewModel.isSelected(this.item2)).to.be.false;
            expect(viewModel.isSelected(this.item3)).to.be.false;

            viewModel.selectItem(ev as any, this.item1);
            expect(viewModel.isSelected(this.item1)).to.be.false;
            expect(viewModel.isSelected(this.item2)).to.be.false;
            expect(viewModel.isSelected(this.item3)).to.be.false;

            viewModel.selectItem(ev as any, this.item1);
            viewModel.selectItem(ev as any, this.item3);
            expect(viewModel.isSelected(this.item1)).to.be.true;
            expect(viewModel.isSelected(this.item2)).to.be.false;
            expect(viewModel.isSelected(this.item3)).to.be.true;

            done();
        })
    }

    @test
    public 'selectItem() with SHIFT should select an item range'(done: MochaDone) {
        this.createAndGetViewModel('<content-list></content-list>', 'content-list').then((viewModel) => {
            const ev = new MockDragEvent();
            viewModel.MultiSelect = true;
            viewModel.Items = [this.item1, this.item2, this.item3, this.item4];

            viewModel.selectItem(ev as any, this.item1);
            expect(viewModel.isSelected(this.item1)).to.be.true;
            expect(viewModel.isSelected(this.item2)).to.be.false;
            expect(viewModel.isSelected(this.item3)).to.be.false;
            expect(viewModel.isSelected(this.item4)).to.be.false;

            ev.shiftKey = true;
            viewModel.selectItem(ev as any, this.item3);
            expect(viewModel.isSelected(this.item1)).to.be.true;
            expect(viewModel.isSelected(this.item2)).to.be.true;
            expect(viewModel.isSelected(this.item3)).to.be.true;
            expect(viewModel.isSelected(this.item4)).to.be.false;

            ev.shiftKey = false;
            viewModel.selectItem(ev as any, this.item4);
            expect(viewModel.isSelected(this.item1)).to.be.false;
            expect(viewModel.isSelected(this.item2)).to.be.false;
            expect(viewModel.isSelected(this.item3)).to.be.false;
            expect(viewModel.isSelected(this.item4)).to.be.true;

            ev.shiftKey = true;
            viewModel.selectItem(ev as any, this.item2);
            expect(viewModel.isSelected(this.item1)).to.be.false;
            expect(viewModel.isSelected(this.item2)).to.be.true;
            expect(viewModel.isSelected(this.item3)).to.be.true;
            expect(viewModel.isSelected(this.item4)).to.be.true;            

            done();
        })
    }

    @test
    public 'toggleSelection() should select simple items if multiselect is disabled'(done: MochaDone) {
        this.createAndGetViewModel('<content-list></content-list>', 'content-list').then((viewModel) => {
            const ev = new MockDragEvent();
            viewModel.MultiSelect = false;
            viewModel.Items = [this.item1, this.item2, this.item3];

            viewModel.toggleSelection(ev as any, this.item1);
            expect(viewModel.isSelected(this.item1)).to.be.true;
            expect(viewModel.isSelected(this.item2)).to.be.false;
            expect(viewModel.isSelected(this.item3)).to.be.false;

            viewModel.toggleSelection(ev as any, this.item2);
            expect(viewModel.isSelected(this.item1)).to.be.false;
            expect(viewModel.isSelected(this.item2)).to.be.true;
            expect(viewModel.isSelected(this.item3)).to.be.false;

            viewModel.toggleSelection(ev as any, this.item3);
            expect(viewModel.isSelected(this.item1)).to.be.false;
            expect(viewModel.isSelected(this.item2)).to.be.false;
            expect(viewModel.isSelected(this.item3)).to.be.true;

            done();
        })
    }

    @test
    'Reinitialize() should return, if triggered twice while loading'(done: MochaDone){
        this.createAndGetViewModel('<content-list></content-list>', 'content-list').then((viewModel) => {
            viewModel.Query = this.mockRepo.CreateQuery(q => q.Equals('DisplayName', 'Example'));
            viewModel.GetItems = () => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => resolve(), 10);
                })
            }
            viewModel.Reinitialize();
            viewModel.Reinitialize();
            done();
        });
    }

    @test
    'ReloadOnContentChange() should return true'(done: MochaDone){
        this.createAndGetViewModel('<content-list></content-list>', 'content-list').then((viewModel) => {
            expect(viewModel.ReloadOnContentChange(null as any)).to.be.true;
            done();
        });
    }

    @test
    'handleContentChanges() should trigger a reinitialize'(done: MochaDone){
        this.createAndGetViewModel('<content-list></content-list>', 'content-list').then((viewModel) => {
            viewModel.GetItems = () => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => resolve(), 10);
                })
            }
            viewModel.handleContentChanges({Id: 123});
            expect(viewModel.IsLoading).to.be.true;
            done();
        });
    }

    @test
    'dropContent() should trigger a move operation if the Content is in the scope'(done: MochaDone){
        this.createAndGetViewModel('<content-list></content-list>', 'content-list').then((viewModel) => {
            this.mockRepo.httpProviderRef.setResponse({
                ...viewModel.Scope,
                Path: 'Root2/Example',
                Name: 'Example'
            });
            this.mockRepo.Authentication.stateSubject.next(Authentication.LoginState.Authenticated);
            this.mockRepo.Events.OnContentMoved.first().subscribe(u => {
                done();
            }, done);
            viewModel.Scope = this.mockRepo.HandleLoadedContent({
                Id: 123,
                Path: 'Root2',
                Name: 'Root'
            })
            viewModel.dropContent(this.item1.Stringify());
        });
    }
}