/**
 * @module ViewControls
 *
 */ /** */

import { IContent, Repository } from "@sensenet/client-core";
import { ActionName, ControlSchema } from "@sensenet/control-mapper";
import { FieldSetting } from "@sensenet/default-content-types";
import { autoinject, bindable } from "aurelia-framework";
import { ControlMappingService, ControlNameResolverService } from "../services";

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
    public content!: IContent;

    /**
     * The Original content for change tracking
     */
    @bindable
    public originalContent!: IContent;

    /**
     * the bindable ControlSchema object
     */
    @bindable
    public schema!: ControlSchema<object, FieldSetting>;

    /**
     * The optional ActionName
     */
    @bindable
    public actionName?: ActionName;

    private parseSchema() {
        this.schema.fieldMappings = this.schema && this.schema.fieldMappings && this.schema.fieldMappings.map((m) => {
            return {
                ...m,
                ControlTypeName: this.controlNameResolverService.getNameForControl(m.controlType),
            };
        });
    }

    constructor(
        private controlNameResolverService: ControlNameResolverService,
        private controlMappingService: ControlMappingService,
        private repository: Repository,
    ) {
    }

    /**
     * a general activation method, that can be used with composition
     * @param { schema: ControlSchema<AureliaBaseControl, FieldSettings.FieldSetting>, content: Content, actionName: ActionName } model The model to be provided to activate the Control
     */
    public async activate(model: { schema: ControlSchema<object, FieldSetting>, content: IContent, actionName: ActionName }) {
        this.content = model.content;
        if (model.content && model.content.Id || model.content.Path) {
            const reloaded = (await this.repository.load({
                idOrPath: model.content.Id || model.content.Path,
                oDataOptions: {
                    select: "all",
                    expand: model.schema.schema.FieldSettings.filter((a) => a.Type === "ReferenceFieldSetting").map((a) => a.Name) as any,
                },
            })).d;
            Object.assign(this.content, reloaded);
        }
        this.originalContent = Object.assign({}, this.content);
        this.schema = model.schema;
        this.actionName = model.actionName;
        this.parseSchema();

    }

    public actionNameChanged(newName: ActionName, oldName: ActionName) {
        if (newName === "view") {
            const savedFields = Object.assign({}, this.originalContent);
            Object.assign(this.content, savedFields);
        }
        // ToDo: Check
        this.schema = this.content && this.controlMappingService.GetMappings(this.repository).getFullSchemaForContentType(this.content.Type, this.actionName || "view");
        this.parseSchema();
    }
}
