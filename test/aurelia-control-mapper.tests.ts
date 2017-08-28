import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { AureliaControlMapper } from '../src/AureliaControlMapper';
import { ContentTypes, Schemas, FieldSettings } from 'sn-client-js';
import { NameField, DisplayName, ShortText, LongText, RichText, DateTime, Integer, Number as NumberField, Percentage, Password, DateOnly, Checkbox, ContentReference } from '../src';

@suite('AureliaControlMapper Tests')
export class AureliaControlMapperTests {

    @test
    public async 'Should be initialized'() {
        expect(AureliaControlMapper).to.be.instanceOf(Object);
    }

    @test
    public async 'NameField should be assigned to Name setting'() {
        expect(AureliaControlMapper.GetControlForContentField(ContentTypes.Task, 'Name', 'new')).to.be.eq(NameField)
    }


    @test
    public async 'DisplayName should be assigned to DisplayName setting'() {
        expect(AureliaControlMapper.GetControlForContentField(ContentTypes.Task, 'DisplayName', 'new')).to.be.eq(DisplayName);
    }

    @test
    public async 'ShortText should be assigned to short text settings other than Name and DisplayName'() {
        expect(AureliaControlMapper.GetControlForContentField(ContentTypes.User, 'FullName', 'new')).to.be.eq(ShortText);
    }

    @test
    public async 'Password should be assigned to Password field'() {
        expect(AureliaControlMapper.GetControlForContentField(ContentTypes.User, 'Password', 'new')).to.be.eq(Password);
    }

    @test
    public async 'LongText should be assigned to LongText when TextType is not RichText'() {
        expect(AureliaControlMapper.GetControlForContentField(ContentTypes.User, 'Description', 'new')).to.be.eq(LongText);
    }

    @test
    public async 'RichText should be assigned to LongText when TextType is RichText'() {
        expect(AureliaControlMapper.GetControlForContentField(ContentTypes.Email, 'Body', 'new')).to.be.eq(RichText);
    }


    @test
    public async 'DateTime should be assigned to DateTime'() {
        expect(AureliaControlMapper.GetControlForContentField(ContentTypes.Task, 'DueDate', 'new')).to.be.eq(DateTime);
    }

    @test
    public async 'DateOnly should be assigned to DateTime if DateTimeMode is not DateAndTime'() {
        const userSchema = Schemas.SchemaStore.find(s => s.ContentType === ContentTypes.User);
        if (userSchema){
            (userSchema.FieldSettings.find(s => s.Name === 'BirthDate') as FieldSettings.DateTimeFieldSetting).VisibleEdit = FieldSettings.FieldVisibility.Show;
        }
        expect(AureliaControlMapper.GetControlForContentField(ContentTypes.User, 'BirthDate', 'edit')).to.be.eq(DateOnly);
    }


    @test
    public async 'User Enabled should return a checkbox'() {
        expect(AureliaControlMapper.GetControlForContentField(ContentTypes.User, 'Enabled', 'edit')).to.be.eq(Checkbox);
    }      


    @test
    public async 'GenericContent RateAvg should return a NumberField'() {
        const genericContentSchema = Schemas.SchemaStore.find(s => s.ContentType === ContentTypes.GenericContent);
        if (genericContentSchema){
            (genericContentSchema.FieldSettings.find(s => s.Name === 'RateAvg') as FieldSettings.DateTimeFieldSetting).VisibleEdit = FieldSettings.FieldVisibility.Show;
        }               
        expect(AureliaControlMapper.GetControlForContentField(ContentTypes.GenericContent, 'RateAvg', 'edit')).to.be.eq(NumberField);
    }        
    

    @test
    public async 'User CreatedBy should return a ContentReference'() {
        const userSchema = Schemas.SchemaStore.find(s => s.ContentType === ContentTypes.User);
        if (userSchema){
            (userSchema.FieldSettings.find(s => s.Name === 'CreatedBy') as FieldSettings.DateTimeFieldSetting).VisibleEdit = FieldSettings.FieldVisibility.Show;
        }        
        expect(AureliaControlMapper.GetControlForContentField(ContentTypes.User, 'CreatedBy', 'edit')).to.be.eq(ContentReference);
    }      
    
    @test
    public async 'Integer should be assigned to IntegerField'() {
        expect(AureliaControlMapper.GetControlForContentField(ContentTypes.Settings, 'PageCount', 'view')).to.be.eq(Integer);
    }

    @test
    public async 'Percentage should be assigned to IntegerField if flag is set'() {
        expect(AureliaControlMapper.GetControlForContentField(ContentTypes.Task, 'TaskCompletion', 'new')).to.be.eq(Percentage);
    }


}