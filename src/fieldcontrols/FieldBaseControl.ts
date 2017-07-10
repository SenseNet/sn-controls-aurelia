import { AureliaClientFieldConfig } from '../AureliaClientFieldConfig';
import { AureliaBaseControl } from '../AureliaBaseControl';
import { Content, FieldSettings, ActionName } from 'sn-client-js';

import { ValidationController, ValidationRules } from 'aurelia-validation';
import { MaterializeFormValidationRenderer } from 'aurelia-materialize-bridge';
import { computedFrom, bindable } from 'aurelia-framework';

export class FieldBaseControl<TValueType, TConfigType extends FieldSettings.FieldSetting>
        extends AureliaBaseControl {
    @bindable
    content: Content;

    controller: ValidationController;

    @bindable
    actionName: ActionName;

    @computedFrom('settings', 'actionName')
    get readOnly(){
        return !this.settings || this.settings.ReadOnly || this.actionName === 'view';
    }

    @computedFrom('content', 'settings', 'actionName')
    public get rules(): any{
        let rules: any = ValidationRules;
        if (this.settings && this.settings.Compulsory){
            rules = rules.ensure('value').required();
        }
        return rules.rules;
    }

    
    get value(): TValueType{
        return this.settings && this.content && this.content[this.settings.Name];
    }

    set value(newValue: TValueType){
        this.content[this.settings.Name] = newValue;
    }

    isDirty: boolean;
    settings: TConfigType;
    activate(model: {settings: TConfigType, content: Content, controller: ValidationController, actionName: ActionName}){
        this.content = model.content;
        this.settings = model.settings;
        this.controller = model.controller;
        this.actionName = model.actionName;
        this.value = this.content[this.settings.Name] || this.settings.DefaultValue || '';
    }

}