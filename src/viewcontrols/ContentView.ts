/**
 * @module ViewControls
 * 
 * 
 */ /** */
import { bindable, autoinject } from 'aurelia-framework';
import { ActionName } from 'sn-client-js';
import { Content, ControlSchema, FieldSettings, ContentTypes } from 'sn-client-js';
import { ControlMappingService, ControlNameResolverService } from '../services';
import { GenericContent } from 'sn-client-js/dist/src/Content/DefaultContentTypes';

/**
 * A very top level View Control, works with a single Content and based on the AureliaControlMapper
 * 
 * Usage:
 * ```html
 *  <content-view content.bind='contentInstance'></content-view>
 * ```
 */
@autoinject
 export class ContentView  {
    constructor(
        private controlMappingService: ControlMappingService,
        private ControlNameResolverService: ControlNameResolverService
    ) {
    }

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

    @bindable
    controlName: string;



    contentChanged(){
        this.contextChange();
    } 
    actionNameChanged(){
        this.contextChange();
    }
    public contextChange: () => void = () => {
        // ToDo: Reload content with required fields
        const contentType = this.content && (ContentTypes as any)[this.content.Type] || GenericContent as {new(...args)};
        const schema = this.content && this.controlMappingService.GetMappings(this.content.GetRepository()).GetFullSchemaForContentType(contentType, this.actionName);
        this.controlName = this.ControlNameResolverService.getNameForControl(schema && schema.ContentTypeControl);

        this.model = {
            schema,
            content: this.content,
            actionName: this.actionName
        };
    }

    @bindable
    public model: { 
        schema: ControlSchema<{}, FieldSettings.FieldSetting>,
        actionName: ActionName,
        content: Content
    };
}