import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ContentTypes, FieldSettings, Mocks, ODataApi, Authentication } from 'sn-client-js';
import { ContentListReference } from '../../src/fieldcontrols';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

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
        viewModel.settings = new FieldSettings.ReferenceFieldSetting({
            readOnly: true
        });
        viewModel.content = new ContentTypes.Task({} as any, this.mockRepo);
        const contentViewElement = document.querySelector('content-reference .search-box');
        expect(contentViewElement).to.be.null;
    }

    @test
    public async 'Required rule is added if complusory'() {
        const viewModel = await this.createFieldViewModel();
        const content = new ContentTypes.Task({} as any, this.mockRepo); ;
        const settings = new FieldSettings.ReferenceFieldSetting({
            compulsory: true
        });
        viewModel.activate({content, settings})        
        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq('required');
    }

    @test
    public 'searchStringChanged should trigger an OData call'(done: MochaDone) {

        const mockRepo = new Mocks.MockRepository();

        this.createFieldViewModel().then(viewModel => {
            const content = mockRepo.CreateContent({}, ContentTypes.Group);
            const settings = new FieldSettings.ReferenceFieldSetting({
                compulsory: true,
                name: 'Members'
            });

            mockRepo.httpProviderRef.setResponse(<ODataApi.ODataCollectionResponse<ContentTypes.User>>{ d: { __count: 1, results: [{ Id: 1, Name: 'user' }] } })
            mockRepo.Authentication.stateSubject.next(Authentication.LoginState.Authenticated);

            viewModel.activate({ content, settings });
            mockRepo.httpProviderRef.setResponse(<ODataApi.ODataCollectionResponse<ContentTypes.User>>{ d: { __count: 1, results: [{ Id: 1, Name: 'user' }] } })

            setTimeout(() => {
                mockRepo.httpProviderRef.setResponse(<ODataApi.ODataCollectionResponse<ContentTypes.User>>{
                    d: {
                        __count: 1,
                        results: [{
                            Id: 4,
                            Name: 'alma'
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
        viewModel.settings = new FieldSettings.ReferenceFieldSetting({
            compulsory: true
        })

        viewModel.isFocused = true;
        viewModel.isOpened = true;
        viewModel.focusOut()
        expect(viewModel.isFocused).to.be.false;
        expect(viewModel.isOpened).to.be.false;
    }

    @test
    public async 'PickValue'() {
        const viewModel = await this.createFieldViewModel();
        const content = this.mockRepo.HandleLoadedContent({ Id: 123, Path: 'Root/Content1' }, ContentTypes.Group);

        viewModel.content = content;
        viewModel.controller = { validate: () => { } } as any;
        viewModel.settings = new FieldSettings.ReferenceFieldSetting({
            compulsory: true,
            name: 'Members'
        });


        const c1 = this.mockRepo.HandleLoadedContent({ Id: 123, Path: 'Root/Content1' }, ContentTypes.User);
        viewModel.Items = [];

        viewModel.pickValue(c1);
        expect(viewModel.Items[0]).to.be.eq(c1);
        expect(viewModel.value['contentReferences'][0]).to.be.eq(c1);
    }

    @test
    public async 'removeItem'() {
        const viewModel = await this.createFieldViewModel();
        const content = this.mockRepo.HandleLoadedContent({ Id: 123, Path: 'Root/Content1' }, ContentTypes.Group);

        viewModel.content = content;
        viewModel.controller = { validate: () => { } } as any;
        viewModel.settings = new FieldSettings.ReferenceFieldSetting({
            compulsory: true,
            name: 'Members'
        });


        const c1 = this.mockRepo.HandleLoadedContent({ Id: 123, Path: 'Root/Content1' }, ContentTypes.User);
        viewModel.Items = [c1];

        viewModel.removeReference(c1);
        expect(viewModel.Items).to.be.empty;
        expect(viewModel.value['contentReferences']).to.be.empty;
    }
}