/**
 * @module ViewControls
 * 
 * 
 */ /** */
import { bindable, computedFrom } from 'aurelia-framework';
import { ActionName } from 'sn-client-js';
import { Content, ControlSchema, FieldSettings, ContentTypes } from 'sn-client-js';

import { AureliaBaseControl } from '../AureliaBaseControl';
import { AureliaControlMapper } from '../AureliaControlMapper';


/**
 * A very top level View Control, works with a single Content and based on the AureliaControlMapper
 * 
 * Usage:
 * ```html
 *  <content-view content.bind='contentInstance'></content-view>
 * ```
 */
export class ContentView extends AureliaBaseControl {

    /**
     * The bindable Content instance
     */
    @bindable
    public content: Content;

    /**
     * @returns the ActionName, it is based on the Content state ('view' by default, 'new' if the content is not saved yet)
     */
    @bindable
    public actionName: ActionName  = 'view';

    /**
     * @returns the Schema object, based on the binded content and the assigned actionName
     */
    @computedFrom('content', 'actionName')
    public get schema(): ControlSchema<AureliaBaseControl, FieldSettings.FieldSetting>{

        // ToDo: Reload content with required fields
        const contentType = this.content && (ContentTypes as any)[this.content.Type] || Content as {new(...args)};

        return this.content && AureliaControlMapper.GetFullSchemaForContentType(contentType, this.actionName);
    }

    /**
     * @returns the ViewControl, as resolved from the AureliaControlMapper
     */
    @computedFrom('schema')
    public get control(): {new(...args: any[])}{
        return this.schema && this.schema.ContentTypeControl;
    }
}