/**
 * @module FieldControls
 *
 */ /** */

import { IContent, Repository } from "@sensenet/client-core";
import { IODataCollectionResponse } from "@sensenet/client-core/dist/Models/IODataCollectionResponse";
import { PathHelper } from "@sensenet/client-utils";
import { ContentListReferenceField, DeferredObject, ReferenceFieldSetting } from "@sensenet/default-content-types";
import { Query } from "@sensenet/query";
import { bindable, customElement } from "aurelia-framework";
import { FieldBaseControl } from "./FieldBaseControl";

@customElement("contentlist-reference")
export class ContentListReference extends FieldBaseControl<ContentListReferenceField<IContent>, ReferenceFieldSetting> {

    @bindable
    public items: IContent[] = [];

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
        this.availableValues = req.d.results.filter((a) => this.items.findIndex((i) => i.Id === a.Id) === -1 && a.Id !== this.content.Id);
        this.isOpened = true;
        this.selectionIndex = 0;
        return req;
    }

    public removeReference(item: IContent) {
        this.items = this.items.filter((i) => i !== item);
        this.value = this.items.map((a) => a.Id);
    }

    public async activate(model) {
        super.activate(model);
        const loadPath = PathHelper.joinPaths(PathHelper.getContentUrl(this.content.Path), "/", this.settings.Name);
        const references = await this.repository.loadCollection({
            path: loadPath,
            oDataOptions: {
                select: "all",
            },
        });
        this.items = references.d.results;
    }

    public pickValue(content: IContent) {
        this.items.push(content);
        this.items = this.items.map((a) => a);

        this.searchString = "";
        this.isOpened = false;
        this.isFocused = false;
        if (this.rules.length) {
            this.controller.validate();
        }

        this.value = this.items.map((i) => i.Id);
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
