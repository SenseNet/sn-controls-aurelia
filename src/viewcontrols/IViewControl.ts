import { Content, ControlSchema, FieldSettings } from 'sn-client-js';
import { AureliaBaseControl } from '../AureliaBaseControl';
import { AureliaClientFieldConfig } from '../AureliaClientFieldConfig';

export class IViewControl {
    
    public content: Content;

    public schema: ControlSchema<AureliaBaseControl, AureliaClientFieldConfig<FieldSettings.FieldSetting>>;
}