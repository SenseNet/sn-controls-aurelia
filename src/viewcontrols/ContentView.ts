/**
 * @module ViewControls
 *
 *
 */ /** */
import { IContent, Repository } from "@sensenet/client-core";
import { IDisposable, Trace } from "@sensenet/client-utils";
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
    public schemaTrace: IDisposable;
    constructor(
        private repository: Repository,
        private controlMappingService: ControlMappingService,
        private controlNameResolverService: ControlNameResolverService,
    ) {
        this.schemaTrace = Trace.method({
            object: this.repository,
            method: this.repository.reloadSchema,
            isAsync: true,
            onFinished: () => {
                this.controlMappingService.reinitMappings(this.repository);
                this.contextChange();
            },
        });
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

    public unbind() {
        this.schemaTrace.dispose();
    }

    @bindable
    public model!: {
        schema: ControlSchema<{}, FieldSetting>,
        actionName: ActionName,
        content: IContent,
    };
}
