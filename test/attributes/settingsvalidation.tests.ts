import { FieldSetting, ShortTextFieldSetting, TextFieldSetting } from "@sensenet/default-content-types";
import { expect } from "chai";
import "jsdom";
import { SettingsValidationCustomAttribute } from "../../src/attributes";

export const settingsValidationTests = describe("SettingsValidation Tests", () => {

    let element: HTMLElement;
    let attribute: SettingsValidationCustomAttribute;
    beforeEach(() => {
        element = document.createElement("input"); // new HTMLElement();
        attribute = new SettingsValidationCustomAttribute(element);
    });

    it("Can be constructed", () => {
        expect(attribute).to.be.instanceof(SettingsValidationCustomAttribute);
    });

    it("Setting can be bound", () => {
        const s =  {} as FieldSetting;
        attribute.settings = s;
        expect(attribute.settings).to.be.eq(s);
    });

    it("Sets required attribute on input element based on the complusory setting", () => {

        attribute.settingsChanged({
            Compulsory: true,
        } as FieldSetting);
        expect(element.getAttribute("required")).to.be.eq("required");

        attribute.settingsChanged({
            Compulsory: false,
        } as FieldSetting);
        expect(element.getAttribute("required")).to.be.eq(null);
    });

    it("Sets minlength attribute on input element based on the minLength setting", () => {
        attribute.settingsChanged({
            MinLength: 10,
            Type: "TextFieldSetting",
        } as TextFieldSetting);
        expect(element.getAttribute("minlength")).to.be.eq("10");

        attribute.settingsChanged({
            MinLength: undefined,
        } as TextFieldSetting);
        expect(element.getAttribute("minlength")).to.be.eq(null);
    });

    it("Sets maxlength attribute on input element based on the maxLength setting", () => {
        attribute.settingsChanged({
            MaxLength: 10,
            Type: "TextFieldSetting",
        } as TextFieldSetting);
        expect(element.getAttribute("maxlength")).to.be.eq("10");

        attribute.settingsChanged({
            MaxLength: undefined,
        } as TextFieldSetting);
        expect(element.getAttribute("maxlength")).to.be.eq(null);
    });

    it("Sets pattern attribute on input element based on the regex setting", () => {
        attribute.settingsChanged({
            Name: "Example",
            Type: "ShortTextFieldSetting",
            Regex: "example",
        } as ShortTextFieldSetting);
        expect(element.getAttribute("pattern")).to.be.eq("example");

        attribute.settingsChanged({
            Name: "Example",
            Type: "ShortTextFieldSetting",
        } as ShortTextFieldSetting);
        expect(element.getAttribute("pattern")).to.be.eq(null);
    });
});
