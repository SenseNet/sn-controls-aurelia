import { Repository } from "@sensenet/client-core";
import { DateTimeFieldSetting, FieldVisibility, SchemaStore } from "@sensenet/default-content-types";
import { expect } from "chai";
import { Checkbox, ContentReference, DateOnly, DateTime, DisplayName, Integer, LongText, NameField, Number as NumberField, Password, Percentage, RichText, ShortText } from "../../src";
import { ControlMappingService } from "../../src/services";

export const controlMapperTests = describe("AureliaControlMapper Tests", () => {
    const mapper = new ControlMappingService();
    const repo = new Repository();

    it("Should be initialized", () => {
        expect(mapper).to.be.instanceOf(ControlMappingService);
    });

    it("NameField should be assigned to Name setting", () => {
        expect(mapper.GetMappings(repo).getControlForContentField("Task", "Name", "new")).to.be.eq(NameField);
    });

    it("DisplayName should be assigned to DisplayName setting", () => {
        expect(mapper.GetMappings(repo).getControlForContentField("Task", "DisplayName", "new")).to.be.eq(DisplayName);
    });

    it("ShortText should be assigned to short text settings other than Name and DisplayName", () => {
        expect(mapper.GetMappings(repo).getControlForContentField("User", "FullName", "new")).to.be.eq(ShortText);
    });

    it("Password should be assigned to Password field", () => {
        expect(mapper.GetMappings(repo).getControlForContentField("User", "Password", "new")).to.be.eq(Password);
    });

    it("LongText should be assigned to LongText when TextType is not RichText", () => {
        expect(mapper.GetMappings(repo).getControlForContentField("User", "Description", "new")).to.be.eq(LongText);
    });

    it("RichText should be assigned to LongText when TextType is RichText", () => {
        expect(mapper.GetMappings(repo).getControlForContentField("Email", "Body", "new")).to.be.eq(RichText);
    });

    it("DateTime should be assigned to DateTime", () => {
        expect(mapper.GetMappings(repo).getControlForContentField("Task", "DueDate", "new")).to.be.eq(DateTime);
    });

    it("DateOnly should be assigned to DateTime if DateTimeMode is not DateAndTime", () => {
        const userSchema = SchemaStore.find((s) => s.ContentTypeName === "User");
        if (userSchema) {
            (userSchema.FieldSettings.find((s) => s.Name === "BirthDate") as DateTimeFieldSetting).VisibleEdit = FieldVisibility.Show;
        }
        expect(mapper.GetMappings(repo).getControlForContentField("User", "BirthDate", "edit")).to.be.eq(DateOnly);
    });

    it("User Enabled should return a checkbox", () => {
        expect(mapper.GetMappings(repo).getControlForContentField("User", "Enabled", "edit")).to.be.eq(Checkbox);
    });

    it("GenericContent RateAvg should return a NumberField", () => {
        const genericContentSchema = repo.schemas.getSchemaByName("GenericContent");
        if (genericContentSchema) {
            (genericContentSchema.FieldSettings.find((s) => s.Name === "RateAvg") as DateTimeFieldSetting).VisibleEdit = FieldVisibility.Show;
        }
        expect(mapper.GetMappings(repo).getControlForContentField("GenericContent", "RateAvg", "edit")).to.be.eq(NumberField);
    });

    it("User CreatedBy should return a ContentReference", () => {
        const userSchema = repo.schemas.getSchemaByName("User");
        if (userSchema) {
            (userSchema.FieldSettings.find((s) => s.Name === "CreatedBy") as DateTimeFieldSetting).VisibleEdit = FieldVisibility.Show;
        }
        expect(mapper.GetMappings(repo).getControlForContentField("User", "CreatedBy", "edit")).to.be.eq(ContentReference);
    });

    it("Integer should be assigned to IntegerField", () => {
        expect(mapper.GetMappings(repo).getControlForContentField("Settings", "PageCount", "view")).to.be.eq(Integer);
    });

    it("Percentage should be assigned to IntegerField if flag is set", () => {
        expect(mapper.GetMappings(repo).getControlForContentField("Task", "TaskCompletion", "new")).to.be.eq(Percentage);
    });

    it("Workspace IsActive should be assigned to Checkbox", () => {
        expect(mapper.GetMappings(repo).getControlForContentField("Workspace", "IsActive", "new")).to.be.eq(Checkbox);
    });
});
