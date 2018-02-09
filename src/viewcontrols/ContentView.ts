/**
 * @module ViewControls
 *
 *
 */ /** */
import { IContent, Repository } from "@sensenet/client-core";
import { ActionName, ControlSchema } from "@sensenet/control-mapper";
import { FieldSetting, GenericContent } from "@sensenet/default-content-types";
import { autoinject, bindable } from "aurelia-framework";
import { ControlMappingService, ControlNameResolverService } from "../services";

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
        private repository: Repository,
        private controlMappingService: ControlMappingService,
        private controlNameResolverService: ControlNameResolverService,
    ) {
    }

    /**
     * The bindable Content instance
     */
    @bindable
    public content!: IContent;

    /**
     * @returns the ActionName, it is based on the Content state ('view' by default, 'new' if the content is not saved yet)
     */
    @bindable
    public actionName: ActionName  = "view";

    @bindable
    public controlName!: string;

    public contentChanged() {
        this.contextChange();
    }
    public actionNameChanged() {
        this.contextChange();
    }
    public contextChange: () => void = () => {
        // ToDo: Reload content with required fields
        const schema = this.content && this.controlMappingService.GetMappings(this.repository).getFullSchemaForContentType(this.content.Type as string, this.actionName);
        this.controlName = this.controlNameResolverService.getNameForControl(schema && schema.contentTypeControl) as string;

        this.model = {
            schema,
            content: this.content,
            actionName: this.actionName,
        };
    }

    @bindable
    public model!: {
        schema: ControlSchema<{}, FieldSetting>,
        actionName: ActionName,
        content: IContent,
    };
}
