import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ContentTypes, FieldSettings, ODataApi, Authentication, Mocks } from 'sn-client-js';
import { ContentReference } from '../../src/fieldcontrols';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

@suite('ContentReferenceField component')
export class ContentReferenceFieldests extends FieldControlBaseTest<ContentReference> {

    constructor() {
        super(ContentReference, 'content-reference');
    }

    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createFieldViewModel();
        expect(viewModel).to.be.instanceof(ContentReference);
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
        const content = new ContentTypes.Task({} as any, this.mockRepo);
        const settings = new FieldSettings.ReferenceFieldSetting({
            compulsory: true
        });

        viewModel.activate({ content, settings });

        const rules = viewModel.rules;
        expect(rules[0][0].messageKey).to.be.eq('required');
    }

    @test
    public 'searchStringChanged should trigger an OData call'(done: MochaDone) {

        const mockRepo = new Mocks.MockRepository();

        this.createFieldViewModel().then(viewModel => {
            const content = mockRepo.CreateContent({}, ContentTypes.Task);
            const settings = new FieldSettings.ReferenceFieldSetting({
                compulsory: true,
                name: 'CreatedBy'
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
    public 'PickValue'(done: MochaDone) {

        this.mockRepo = new Mocks.MockRepository();

        this.createFieldViewModel().then(viewModel => {
            const content = this.mockRepo.HandleLoadedContent({ Id: 123, Path: 'Root/Content1' }, ContentTypes.User);
            const c1 = this.mockRepo.HandleLoadedContent({ Id: 123, Path: 'Root/Content1' }, ContentTypes.User);
            const c2 = this.mockRepo.HandleLoadedContent({ Id: 12356, Path: 'Root/Content1' }, ContentTypes.User);
            const settings = new FieldSettings.ReferenceFieldSetting({
                compulsory: true,
                name: 'CreatedBy'
            });
            viewModel.activate({ content, settings, controller: { validate: () => { } } });
            viewModel.searchString = 'asd';
            viewModel.isOpened = true;
            viewModel.value.SetContent(c1);
            viewModel.pickValue(c2);
            expect(viewModel.searchString).to.be.empty;
            expect(viewModel.isOpened).to.be.false;
            expect(viewModel.value['contentReference']).to.be.eq(c2);
            done();
        }, done);
    }

    @test
    public async 'FocusIn'() {
        const viewModel = await this.createFieldViewModel();
        let isFocused = false;
        viewModel.searchInput = { focus: () => { isFocused = true; } } as any;

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
    public async 'FocusOut'() {
        const viewModel = await this.createFieldViewModel();
        viewModel.controller = { validate: () => { } } as any;
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
    public async 'removeItem'() {
        const viewModel = await this.createFieldViewModel();
        const content = this.mockRepo.HandleLoadedContent({ Id: 123, Path: 'Root/Content1' }, ContentTypes.User);

        viewModel.content = content;
        viewModel.controller = { validate: () => { } } as any;
        viewModel.settings = new FieldSettings.ReferenceFieldSetting({
            compulsory: true,
            name: 'CreatedBy'
        });


        const c1 = this.mockRepo.HandleLoadedContent({ Id: 123, Path: 'Root/Content1' }, ContentTypes.User);
        viewModel.Item = c1;

        viewModel.removeItem();
        expect(viewModel.Item).to.be.null;
        expect(viewModel.value['contentReference']).to.be.null;
    }
}