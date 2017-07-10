
import { ControlMapper, FieldSettings } from 'sn-client-js';
import { AureliaBaseControl } from './AureliaBaseControl';
import { AureliaClientFieldConfig } from './AureliaClientFieldConfig';
import { GenericView } from './viewcontrols'
import { Choice, DisplayName, DumpField, DateOnly, DateTime, Password, Percentage, Integer, LongText, NameField, Number as NumberField, RichText, ShortText } from './fieldcontrols';

const clientConfigFactory = (fieldSettings: FieldSettings.FieldSetting) => {
    return new AureliaClientFieldConfig(fieldSettings);
}

const AureliaControlMapper =
    new ControlMapper(AureliaBaseControl, clientConfigFactory, GenericView, DumpField)
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

export { AureliaControlMapper };