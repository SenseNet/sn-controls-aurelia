/**
 * @module FieldControls
 *
 */ /** */

import { IContent, Repository } from "@sensenet/client-core";
import { IODataCollectionResponse } from "@sensenet/client-core/dist/Models/IODataCollectionResponse";
import { PathHelper } from "@sensenet/client-utils";
import { ContentReferenceField, ReferenceFieldSetting } from "@sensenet/default-content-types";
import { Query } from "@sensenet/query";
import { bindable, customElement } from "aurelia-framework";
import { FieldBaseControl } from "./FieldBaseControl";

@customElement("content-reference")
export class ContentReference extends FieldBaseControl<ContentReferenceField<IContent>, ReferenceFieldSetting> {

    @bindable
    public item!: IContent;

    @bindable
    public availableValues: IContent[] = [];

    @bindable
    public searchString: string = "";

    @bindable
    public isOpened: boolean = false;

    @bindable
    public isFocused: boolean = false;

    public searchInput!: HTMLInputElement;

    @bindable
    public selectionIndex: number = 0;

    /**
     *
     */
    constructor(public repository: Repository) {
        super();

    }

    public async searchStringChanged(newValue: string): Promise<IODataCollectionResponse<IContent>> {
        // ToDo: Allowed types, typeroots, etc...
        const query = new Query((q) => q.term(newValue)).toString();

        const req = await this.repository.loadCollection({
            path: "Root",
            oDataOptions: {
                query,
                select: "all",
            },
        });
        this.availableValues = req.d.results.filter((a) => this.item && this.item.Id !== a.Id && a.Id !== this.content.Id);
        this.isOpened = true;
        this.selectionIndex = 0;
        return req;
    }

    public async activate(model) {
        super.activate(model);

        super.activate(model);
        const loadPath = PathHelper.joinPaths(PathHelper.getContentUrl(this.content.Path), "/", this.settings.Name);
        try {
            const references = await this.repository.load({
                idOrPath: loadPath,
                oDataOptions: {
                    select: "all",
                },
            });
            this.item = references.d as any;
        } catch (error) {
            /**  */
        }
    }

    public pickValue(content: IContent) {
        this.item = content;

        this.searchString = "";
        this.isOpened = false;
        this.isFocused = false;
        if (this.rules.length) {
            this.controller.validate();
        }

        this.value = this.item.Id;
    }

    public focusIn() {
        if (this.searchString.length > 0) {
            this.isOpened = true;
        }
        this.isFocused = true;
        this.searchInput.focus();
    }

    public focusOut() {
        this.isOpened = false;
        if (this.rules.length) {
            this.controller.validate();
        }

        this.isFocused = false;
    }

    public removeItem() {
        this.item = null as any;
        this.value = null as any;
    }

    public handleSearchKeyUp($event: KeyboardEvent) {
        switch ($event.keyCode) {
            case 38: {
                this.selectionIndex = Math.max(this.selectionIndex - 1, 0);
                break;
            }
            case 40: {
                this.selectionIndex = Math.min(this.selectionIndex + 1, this.availableValues.length - 1);
                break;
            }
            case 13: {
                if (this.availableValues[this.selectionIndex]) {
                    this.pickValue(this.availableValues[this.selectionIndex]);
                    $event.preventDefault();
                    $event.stopPropagation();
                }
            }

        }
    }
}
