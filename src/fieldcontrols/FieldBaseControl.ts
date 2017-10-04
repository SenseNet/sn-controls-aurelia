/**
 * @module FieldControls
 * 
 */ /** */

import { Content, FieldSettings, ActionName } from 'sn-client-js';

import { ValidationController, ValidationRules, FluentRuleCustomizer } from 'aurelia-validation';
import { computedFrom, bindable } from 'aurelia-framework';

/**
 * Base class for field controls. Contains basic binding, activation and validation logic.
 */
export class FieldBaseControl<TValueType, TConfigType extends FieldSettings.FieldSetting> {
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
    public get rules(): FluentRuleCustomizer<any, any>[]{
        let rules: any = ValidationRules;
        if (this.settings && this.settings.Compulsory){
            rules = rules.ensure('value').required();
        }
        return rules.rules || [];
    }

    
    get value(): TValueType{
        return this.settings && this.content && this.content[this.settings.Name];
    }

    set value(newValue: TValueType){
        this.settings && this.content && (this.content[this.settings.Name] = newValue);
    }
    settings: TConfigType;
    activate(model: {settings: TConfigType, content: Content, controller: ValidationController, actionName: ActionName}){
        this.content = model.content;
        this.settings = model.settings;
        this.controller = model.controller;
        this.actionName = model.actionName;
        this.value = this.content && this.settings && this.content[this.settings.Name] || this.settings.DefaultValue || '';
    }

}