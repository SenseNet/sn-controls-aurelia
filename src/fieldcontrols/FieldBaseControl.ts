/**
 * @module FieldControls
 *
 */ /** */

import { IContent } from "@sensenet/client-core";
import { ActionName } from "@sensenet/control-mapper";
import { FieldSetting } from "@sensenet/default-content-types";
import { bindable, computedFrom } from "aurelia-framework";
import { FluentRuleCustomizer, ValidationController, ValidationRules } from "aurelia-validation";

/**
 * Base class for field controls. Contains basic binding, activation and validation logic.
 */
export class FieldBaseControl<TValueType, TConfigType extends FieldSetting> {
    @bindable
    public content!: IContent;

    public controller!: ValidationController;

    @bindable
    public actionName!: ActionName;

    @bindable
    public hasInitialValue!: boolean;

    @computedFrom("settings", "actionName")
    get readOnly() {
        return !this.settings || this.settings.ReadOnly || this.actionName === "view";
    }

    @computedFrom("content", "settings", "actionName")
    public get rules(): Array<FluentRuleCustomizer<any, any>> {
        let rules: any = ValidationRules;
        if (this.settings && this.settings.Compulsory) {
            rules = rules.ensure("value").required();
        }
        return rules.rules || [];
    }

    get value(): TValueType {
        return this.settings && this.content && (this.content as any)[this.settings.Name];
    }

    set value(newValue: TValueType) {
        this.settings && this.content && ((this.content as any)[this.settings.Name] = newValue);
    }
    public settings!: TConfigType;
    public activate(model: {settings: TConfigType, content: IContent, controller: ValidationController, actionName: ActionName}) {
        this.content = model.content;
        this.settings = model.settings;
        this.controller = model.controller;
        this.actionName = model.actionName;
        this.value = this.content && this.settings && (this.content as any)[this.settings.Name] || this.settings.DefaultValue || "";
        this.hasInitialValue = this.value && (this.value.toString().length > 0) || false;
    }

}
