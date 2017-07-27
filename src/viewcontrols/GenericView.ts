/**
 * @module ViewControls
 * 
 */ /** */

import { bindable, autoinject } from 'aurelia-framework';
import { Content, ControlSchema, FieldSettings, ActionName, ContentTypes } from 'sn-client-js';

import { AureliaBaseControl } from '../AureliaBaseControl';
import { AureliaControlMapper } from '../AureliaControlMapper';
import { ValidationController, ValidationControllerFactory } from 'aurelia-validation';
import { MaterializeFormValidationRenderer } from 'aurelia-materialize-bridge';

/**
 * A generic View Control, works based on a single Content, renders FieldControls based on the AureliaControlMapper and the provided Schema. Also responsible to aggregating validation data
 * 
 * Usage:
 * ```html
 *  <generic-view content.bind='contentInstance' schema.bind='contentSchema'></generic-view>
 * ```
 */

@autoinject
export class GenericView extends AureliaBaseControl {
    
    /**
     * The bindable Content instance
     */
    @bindable
    public content: Content;

    /**
     * the bindable ControlSchema object
     */
    @bindable
    public schema: ControlSchema<AureliaBaseControl, FieldSettings.FieldSetting>;

    /**
     * The optional ActionName
     */
    @bindable 
    actionName?: ActionName;

    controller: ValidationController;

    constructor(controllerFactory: ValidationControllerFactory) {
        super();
        this.controller = controllerFactory.createForCurrentScope();
        this.controller.addRenderer(new MaterializeFormValidationRenderer());
    }

    /**
     * a general activation method, that can be used with composition
     * @param { schema: ControlSchema<AureliaBaseControl, FieldSettings.FieldSetting>, content: Content, actionName: ActionName } model The model to be provided to activate the Control
     */
    activate(model: { schema: ControlSchema<AureliaBaseControl, FieldSettings.FieldSetting>, content: Content, actionName: ActionName }) {
        this.schema = model.schema;
        this.content = model.content;
        this.actionName = model.actionName;
    }

    actionNameChanged(newName: ActionName, oldName: ActionName) {
        if (newName === 'view'){
            const savedFields = this.content.SavedFields;
            Object.assign(this.content, savedFields);
        }
        const contentType = this.content && (ContentTypes as any)[this.content.Type] || Content as { new(...args) };
        this.schema = this.content && AureliaControlMapper.GetFullSchemaForContentType(contentType, this.actionName || 'view');
    }
}