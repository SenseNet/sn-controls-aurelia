/**
 * @module ViewControls
 * 
 */ /** */

import { bindable, autoinject } from 'aurelia-framework';
import { Content, ControlSchema, FieldSettings, ActionName, ContentTypes } from 'sn-client-js';
import { ControlNameResolverService, ControlMappingService } from '../services'
import { GenericContent } from 'sn-client-js/dist/src/ContentTypes';

/**
 * A generic View Control, works based on a single Content, renders FieldControls based on the AureliaControlMapper and the provided Schema. Also responsible to aggregating validation data
 * 
 * Usage:
 * ```html
 *  <generic-view content.bind='contentInstance' schema.bind='contentSchema'></generic-view>
 * ```
 */

@autoinject
export class GenericView {
    
    /**
     * The bindable Content instance
     */
    @bindable
    public content: Content;
    

    /**
     * the bindable ControlSchema object
     */
    @bindable
    public schema: ControlSchema<Object, FieldSettings.FieldSetting>;

    /**
     * The optional ActionName
     */
    @bindable 
    actionName?: ActionName;

    private parseSchema(){
        this.schema.FieldMappings = this.schema && this.schema.FieldMappings && this.schema.FieldMappings.map(m => {
            return {
                ...m,
                ControlTypeName: this.ControlNameResolverService.getNameForControl(m.ControlType),
            }
        });
    }


    constructor(
        private ControlNameResolverService: ControlNameResolverService,
        private ControlMappingService: ControlMappingService
    ) {
    }

    /**
     * a general activation method, that can be used with composition
     * @param { schema: ControlSchema<AureliaBaseControl, FieldSettings.FieldSetting>, content: Content, actionName: ActionName } model The model to be provided to activate the Control
     */
    activate(model: { schema: ControlSchema<Object, FieldSettings.FieldSetting>, content: Content, actionName: ActionName }) {
        this.content = model.content;
        this.schema = model.schema;
        this.actionName = model.actionName;
        this.parseSchema();

    }

    actionNameChanged(newName: ActionName, oldName: ActionName) {
        if (newName === 'view'){
            const savedFields = this.content.SavedFields;
            Object.assign(this.content, savedFields);
        }
        // ToDo: Check
        const contentType = this.content && (ContentTypes as any)[this.content.Type] || GenericContent as { new(...args) };
        this.schema = this.content && this.ControlMappingService.GetMappings(this.content.GetRepository()).GetFullSchemaForContentType(contentType, this.actionName || 'view');
        this.parseSchema();
    }
}