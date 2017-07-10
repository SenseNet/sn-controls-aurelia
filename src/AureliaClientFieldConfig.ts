import { FieldSettings } from 'sn-client-js';

export class AureliaClientFieldConfig<TFieldSettings extends FieldSettings.FieldSetting> {
    constructor(public readonly FieldSettings: TFieldSettings) {
        
    }
}