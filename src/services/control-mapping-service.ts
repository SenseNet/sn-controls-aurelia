import { ControlMapper, FieldSettings, ContentTypes } from 'sn-client-js';
import { Choice, DisplayName, DumpField, DateOnly, DateTime, Password, Percentage, Integer, LongText, NameField, Number as NumberField, RichText, ShortText, Checkbox, ContentReference, ContentListReference } from '../fieldcontrols';

export class ControlMappingService{

    private _mappings: ControlMapper<Object, FieldSettings.FieldSetting>;
    private initMappings() {
        this._mappings = new ControlMapper(Object, (s) => s, {name: 'GenericView'} as any, DumpField)
        .SetupFieldSettingDefault(FieldSettings.ShortTextFieldSetting, (setting) => {
            switch (setting.Name) {
                case 'Name':
                    return NameField;
                case 'DisplayName':
                    return DisplayName;
                default:
                    break;
            }
            return ShortText;
        })
        .SetupFieldSettingDefault(FieldSettings.LongTextFieldSetting, (setting) => {
            if (setting.TextType && setting.TextType === FieldSettings.TextType.RichText){
                return RichText;
            }
            return LongText;
        })
        .SetupFieldSettingDefault(FieldSettings.DateTimeFieldSetting, (setting) => {
            if (setting.DateTimeMode === FieldSettings.DateTimeMode.DateAndTime){
                return DateTime;
            }
            return DateOnly;
        })
        .SetupFieldSettingDefault(FieldSettings.NumberFieldSetting, setting => NumberField)
        .SetupFieldSettingDefault(FieldSettings.PasswordFieldSetting, setting => Password)
        .SetupFieldSettingDefault(FieldSettings.ChoiceFieldSetting, settings => {
            return Choice;
        })
        .SetupFieldSettingDefault(FieldSettings.IntegerFieldSetting, (setting) => {
            if (setting.ShowAsPercentage) {
                return Percentage;
            }
            return Integer;
        })
        .SetupFieldSettingDefault(FieldSettings.ReferenceFieldSetting, (setting) => {
            if (setting.AllowMultiple){
                return ContentListReference;
            }
            return ContentReference;
        })
        .SetupFieldSettingForControl(ContentTypes.User, 'Enabled', () => { return Checkbox; })
        .SetupFieldSettingForControl(ContentTypes.Workspace, 'IsWallContainer', () => { return Checkbox; })
        .SetupFieldSettingForControl(ContentTypes.Workspace, 'IsActive', () => { return Checkbox; })
    }



    public get Mappings(){
        if (!this._mappings){
            this.initMappings();
        }
        return this._mappings;
    } 
}