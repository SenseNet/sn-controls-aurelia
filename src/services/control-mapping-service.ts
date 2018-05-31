/**
 * @module Services
 *
 */ /** */
import { Repository } from "@sensenet/client-core";
import { ControlMapper } from "@sensenet/control-mapper";
import { ChoiceFieldSetting, DateTimeFieldSetting, DateTimeMode, FieldSetting, IntegerFieldSetting, LongTextFieldSetting, NumberFieldSetting, PasswordFieldSetting, ReferenceFieldSetting, ShortTextFieldSetting, TextType, User, Workspace } from "@sensenet/default-content-types";
import { Checkbox, Choice, ContentListReference, ContentReference, DateOnly, DateTime, DisplayName, DumpField, Integer, LongText, NameField, Number as NumberField, Password, Percentage, RichText, ShortText } from "../fieldcontrols";
import { GenericView } from "../index";

export class ControlMappingService {

    private mappings!: ControlMapper<object, FieldSetting>;

    public reinitMappings(repo: Repository) {
        this.mappings = new ControlMapper(repo, Object, (s) => s, GenericView, DumpField)
        .setupFieldSettingDefault(ShortTextFieldSetting, (setting) => {
            switch (setting.Name) {
                case "Name":
                    return NameField;
                case "DisplayName":
                    return DisplayName;
                default:
                    break;
            }
            return ShortText;
        })
        .setupFieldSettingDefault(LongTextFieldSetting, (setting) => {
            if (setting.TextType && setting.TextType === TextType.RichText) {
                return RichText;
            }
            return LongText;
        })
        .setupFieldSettingDefault(DateTimeFieldSetting, (setting) => {
            if (setting.DateTimeMode === DateTimeMode.DateAndTime) {
                return DateTime;
            }
            return DateOnly;
        })
        .setupFieldSettingDefault(NumberFieldSetting, (setting) => NumberField)
        .setupFieldSettingDefault(PasswordFieldSetting, (setting) => Password)
        .setupFieldSettingDefault(ChoiceFieldSetting, (settings) => {
            return Choice;
        })
        .setupFieldSettingDefault(IntegerFieldSetting, (setting) => {
            if (setting.ShowAsPercentage) {
                return Percentage;
            }
            return Integer;
        })
        .setupFieldSettingDefault(ReferenceFieldSetting, (setting) => {
            if (setting.AllowMultiple) {
                return ContentListReference;
            }
            return ContentReference;
        })
        .setupFieldSettingForControl(User, "Enabled", () => Checkbox)
        .setupFieldSettingForControl(Workspace, "IsWallContainer", () => Checkbox)
        .setupFieldSettingForControl(Workspace, "IsActive", () => Checkbox);
    }

    public GetMappings(repo: Repository) {
        if (!this.mappings) {
            this.reinitMappings(repo);
        }
        return this.mappings;
    }
}
