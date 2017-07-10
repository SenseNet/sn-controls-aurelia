import { bindable, PLATFORM, computedFrom } from 'aurelia-framework';
import { ActionName } from 'sn-client-js';
import { Content, ControlSchema, FieldSettings, ContentTypes } from 'sn-client-js';

import { AureliaBaseControl } from '../AureliaBaseControl';
import { AureliaControlMapper } from '../AureliaControlMapper';
import { AureliaClientFieldConfig } from '../AureliaClientFieldConfig';
import { IViewControl } from './IViewControl';


export class ContentView extends AureliaBaseControl implements IViewControl {

    @bindable
    public content: Content;

    @computedFrom('content')
    public get actionName(): ActionName {
        if (!this.content || !this.content.IsSaved){
            return 'new';
        }
        return 'view';
    };    

    @computedFrom('content', 'actionName')
    public get schema(): ControlSchema<AureliaBaseControl, AureliaClientFieldConfig<FieldSettings.FieldSetting>>{

        // ToDo: Reload content with required fields
        const contentType = this.content && (ContentTypes as any)[this.content.Type] || Content as {new(...args)};

        return this.content && AureliaControlMapper.GetFullSchemaForContentTye(contentType, this.actionName);
    }

    @computedFrom('schema')
    public get control(): {new(...args: any[])}{
        return this.schema && this.schema.ContentTypeControl;
    }

    constructor() {
        super();
    }

}