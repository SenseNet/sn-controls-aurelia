import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ContentTypes, FieldSettings, Mocks, ODataApi, Authentication } from 'sn-client-js';
import { ContentListReference } from '../../src/fieldcontrols';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';
import { Group, User } from 'sn-client-js/dist/src/Content/DefaultContentTypes';

@suite('ContentListReferenceField component')
export class ContentListReferenceFieldests extends FieldControlBaseTest<ContentListReference> {

    constructor() {
        super(ContentListReference, 'contentlist-reference');
    }

    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createFieldViewModel();
        expect(viewModel).to.be.instanceof(ContentListReference);
    }

    @test
    public async 'Can not be modified if is read only'() {
        const viewModel = await this.createFieldViewModel();
        viewModel.settings = {
            ReadOnly: true
        } as FieldSettings.ReferenceFieldSetting;
        viewModel.content = this.mockRepo.HandleLoadedContent({Id: 12387, Path: 'asd', Name: ''});
        const contentViewElement = document.querySelector('content-reference .search-box');
        expect(contentViewElement).to.be.null;
    }

    @test
    public async 'Required rule is added if complusory'() {
        const viewModel = await this.createFieldViewModel();
        const content = this.mockRepo.HandleLoadedContent({Id: 123827, Path: 'asd', Name: 'Test'}, ContentTypes.Task);
        const settings = {
            Compulsory: true
        } as FieldSettings.ReferenceFieldSetting;
        viewModel.activate({content, settings})        
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq('required');
    }

    @test
    public 'searchStringChanged should trigger an OData call'(done: MochaDone) {

        const mockRepo = new Mocks.MockRepository();

        this.createFieldViewModel().then(viewModel => {
            const content = mockRepo.HandleLoadedContent({Name: 'TestGroup', Id: 1238756, Path: 'Root/Example/TestGroup'}, Group);
            const settings = {
                Compulsory: true,
                Name: 'Members'
            } as FieldSettings.ReferenceFieldSetting;
            mockRepo.Authentication.StateSubject.next(Authentication.LoginState.Authenticated);
            viewModel.activate({ content, settings });

            setTimeout(() => {                
            mockRepo.HttpProviderRef
            .AddResponse(<ODataApi.ODataCollectionResponse<ContentTypes.User>>{
                d: {
                    __count: 1,
                    results: [{
                        Id: 4,
                        Name: 'alma',
                        Path: 'Root/Test'
                    }]
                },
            });

            viewModel.searchStringChanged('alma').subscribe(r => {
                expect(r.Count).to.be.eq(1);
                expect(r.Result[0].Name).to.be.eq('alma');
                done();
            }, done);
        }, 200);
        }, done);
    }

    @test
    public async 'FocusIn'(){
        const viewModel = await this.createFieldViewModel();
        let isFocused = false;
        viewModel.searchInput = { focus: () => {isFocused = true; }} as any;
        
        viewModel.isFocused = false;
        viewModel.isOpened = false;
        viewModel.focusIn()
        expect(viewModel.isFocused).to.be.true;
        expect(viewModel.isOpened).to.be.false;
        expect(isFocused).to.be.true;

        viewModel.searchString = 'asd';
        viewModel.focusIn()
        expect(viewModel.isOpened).to.be.true;
    }


    @test
    public async 'FocusOut'(){
        const viewModel = await this.createFieldViewModel();

        viewModel.controller = {validate: () => {}} as any;
        viewModel.settings = {
            Compulsory: true
        } as FieldSettings.ReferenceFieldSetting

        viewModel.isFocused = true;
        viewModel.isOpened = true;
        viewModel.focusOut()
        expect(viewModel.isFocused).to.be.false;
        expect(viewModel.isOpened).to.be.false;
    }

    @test
    public async 'PickValue'() {
        const viewModel = await this.createFieldViewModel();
        const content = this.mockRepo.HandleLoadedContent<Group>({Type: 'Group', Id: 12845, Path: 'root/groups', Name: 'Group1'});

        viewModel.content = content;
        viewModel.controller = { validate: () => { } } as any;
        viewModel.settings = {
            Compulsory: true,
            Name: 'Members'
        } as FieldSettings.ReferenceFieldSetting;


        const c1 = this.mockRepo.HandleLoadedContent<User>({ Id: 123, Path: 'Root/Content1', Name: 'Usr' });
        viewModel.Items = [];

        viewModel.pickValue(c1);
        expect(viewModel.Items[0]).to.be.eq(c1);
        expect(viewModel.value['_contentReferences'][0]).to.be.eq(c1);
    }

    @test
    public async 'removeItem'() {
        const viewModel = await this.createFieldViewModel();
        const content = this.mockRepo.HandleLoadedContent<Group>({Type: 'Group', Id: 12845, Path: 'root/groups', Name: 'Group1'});

        viewModel.content = content;
        viewModel.controller = { validate: () => { } } as any;
        viewModel.settings = {
            Compulsory: true,
            Name: 'Members'
        } as FieldSettings.ReferenceFieldSetting;


        const c1 = this.mockRepo.HandleLoadedContent<User>({ Id: 123, Path: 'Root/Content1', Name: 'Usr' });
        viewModel.Items = [c1];

        viewModel.removeReference(c1);
        expect(viewModel.Items).to.be.empty;
        expect(viewModel.value['_contentReferences']).to.be.empty;
    }
}