import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ContentTypes, DefaultSchemaStore, FieldSettings } from 'sn-client-js';
import { NameField, DisplayName, ShortText, LongText, RichText, DateTime, Integer, Number as NumberField, Percentage, Password, DateOnly, Checkbox, ContentReference } from '../../src';
import { ControlMappingService } from '../../src/services';
import { MockRepository } from 'sn-client-js/dist/test/Mocks';

@suite('AureliaControlMapper Tests')
export class AureliaControlMapperTests {

    private mapper = new ControlMappingService();
    private repo = new MockRepository();

    @test
    public async 'Should be initialized'() {
        expect(this.mapper).to.be.instanceOf(ControlMappingService);
    }

    @test
    public async 'NameField should be assigned to Name setting'() {
        expect(this.mapper.GetMappings(this.repo).GetControlForContentField(ContentTypes.Task, 'Name', 'new')).to.be.eq(NameField)
    }


    @test
    public async 'DisplayName should be assigned to DisplayName setting'() {
        expect(this.mapper.GetMappings(this.repo).GetControlForContentField(ContentTypes.Task, 'DisplayName', 'new')).to.be.eq(DisplayName);
    }

    @test
    public async 'ShortText should be assigned to short text settings other than Name and DisplayName'() {
        expect(this.mapper.GetMappings(this.repo).GetControlForContentField(ContentTypes.User, 'FullName', 'new')).to.be.eq(ShortText);
    }

    @test
    public async 'Password should be assigned to Password field'() {
        expect(this.mapper.GetMappings(this.repo).GetControlForContentField(ContentTypes.User, 'Password', 'new')).to.be.eq(Password);
    }

    @test
    public async 'LongText should be assigned to LongText when TextType is not RichText'() {
        expect(this.mapper.GetMappings(this.repo).GetControlForContentField(ContentTypes.User, 'Description', 'new')).to.be.eq(LongText);
    }

    @test
    public async 'RichText should be assigned to LongText when TextType is RichText'() {
        expect(this.mapper.GetMappings(this.repo).GetControlForContentField(ContentTypes.Email, 'Body', 'new')).to.be.eq(RichText);
    }


    @test
    public async 'DateTime should be assigned to DateTime'() {
        expect(this.mapper.GetMappings(this.repo).GetControlForContentField(ContentTypes.Task, 'DueDate', 'new')).to.be.eq(DateTime);
    }

    @test
    public async 'DateOnly should be assigned to DateTime if DateTimeMode is not DateAndTime'() {
        const userSchema = DefaultSchemaStore.find(s => s.ContentTypeName === 'User');
        if (userSchema){
            (userSchema.FieldSettings.find(s => s.Name === 'BirthDate') as FieldSettings.DateTimeFieldSetting).VisibleEdit = FieldSettings.FieldVisibility.Show;
        }
        expect(this.mapper.GetMappings(this.repo).GetControlForContentField(ContentTypes.User, 'BirthDate', 'edit')).to.be.eq(DateOnly);
    }


    @test
    public async 'User Enabled should return a checkbox'() {
        expect(this.mapper.GetMappings(this.repo).GetControlForContentField(ContentTypes.User, 'Enabled', 'edit')).to.be.eq(Checkbox);
    }      


    @test
    public async 'GenericContent RateAvg should return a NumberField'() {
        const genericContentSchema = DefaultSchemaStore.find(s => s.ContentTypeName === 'GenericContent');
        if (genericContentSchema){
            (genericContentSchema.FieldSettings.find(s => s.Name === 'RateAvg') as FieldSettings.DateTimeFieldSetting).VisibleEdit = FieldSettings.FieldVisibility.Show;
        }               
        expect(this.mapper.GetMappings(this.repo).GetControlForContentField(ContentTypes.GenericContent, 'RateAvg', 'edit')).to.be.eq(NumberField);
    }        
    

    @test
    public async 'User CreatedBy should return a ContentReference'() {
        const userSchema = new MockRepository().GetSchemaByName('user');
        if (userSchema){
            (userSchema.FieldSettings.find(s => s.Name === 'CreatedBy') as FieldSettings.DateTimeFieldSetting).VisibleEdit = FieldSettings.FieldVisibility.Show;
        }        
        expect(this.mapper.GetMappings(this.repo).GetControlForContentField(ContentTypes.User, 'CreatedBy', 'edit')).to.be.eq(ContentReference);
    }      
    
    @test
    public async 'Integer should be assigned to IntegerField'() {
        expect(this.mapper.GetMappings(this.repo).GetControlForContentField(ContentTypes.Settings, 'PageCount', 'view')).to.be.eq(Integer);
    }

    @test
    public async 'Percentage should be assigned to IntegerField if flag is set'() {
        expect(this.mapper.GetMappings(this.repo).GetControlForContentField(ContentTypes.Task, 'TaskCompletion', 'new')).to.be.eq(Percentage);
    }

    @test
    public async 'Workspace IsActive should be assigned to Checkbox'() {
        expect(this.mapper.GetMappings(this.repo).GetControlForContentField(ContentTypes.Workspace, 'IsActive', 'new')).to.be.eq(Checkbox);
    }
}