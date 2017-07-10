import { bindable, autoinject, computedFrom } from 'aurelia-framework';
import { Content, ControlSchema, FieldSettings, ActionName, ContentTypes } from 'sn-client-js';

import { AureliaBaseControl } from '../AureliaBaseControl';
import { AureliaControlMapper } from '../AureliaControlMapper';
import { AureliaClientFieldConfig } from '../AureliaClientFieldConfig';
import { IViewControl } from './IViewControl';
import { ValidationController } from 'aurelia-validation';
import { MaterializeFormValidationRenderer } from 'aurelia-materialize-bridge';
import { Observable } from '@reactivex/rxjs';

@autoinject
export class GenericView extends AureliaBaseControl implements IViewControl {
    @bindable
    public content: Content;

    @bindable
    public schema: ControlSchema<AureliaBaseControl, AureliaClientFieldConfig<FieldSettings.FieldSetting>>;

    @bindable actionName?: ActionName;

    controller: ValidationController;

    constructor(controller: ValidationController) {
        super();
        this.controller = controller;
        this.controller.addRenderer(new MaterializeFormValidationRenderer());
    }

    activate(model: { schema: ControlSchema<AureliaBaseControl, AureliaClientFieldConfig<FieldSettings.FieldSetting>>, content: Content, actionName: ActionName }) {
        this.schema = model.schema;
        this.content = model.content;
        this.actionName = model.actionName;
    }

    save() {
        return this.content.Save();
    }

    edit() {
        this.actionName = 'edit';
    }

    view() {
        this.actionName = 'view';
    }
    actionNameChanged() {
        const contentType = this.content && (ContentTypes as any)[this.content.Type] || Content as { new(...args) };
        this.schema = this.content && AureliaControlMapper.GetFullSchemaForContentTye(contentType, this.actionName || 'view');
    }
}