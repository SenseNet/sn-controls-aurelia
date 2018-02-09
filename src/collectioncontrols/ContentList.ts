/**
 *  @module CollectionControls
 */ /** */

import { IContent, Repository } from "@sensenet/client-core";
import { IDisposable, PathHelper } from "@sensenet/client-utils";
import { IActionModel } from "@sensenet/default-content-types";
import { Query } from "@sensenet/query";
import { EventHub } from "@sensenet/repository-events";
import { autoinject, bindable, computedFrom, customElement } from "aurelia-framework";
import { BindingSignaler } from "aurelia-templating-resources";

export enum CollectionView {
    List = "List",
    Grid = "Grid",
    Details = "Details",
}

/**
 * Component that lets you display and work with a simple Content Collection
 *
 * Usage example:
 * ```html
 * <content-list scope.bind="Scope"
 *      get-items.call="GetSelectedChildren(scope, query)"
 *      on-activate.call="Select(content)"
 *      on-drop-files.call="FilesDropped(event, files)"
 *      on-drop-content.call="ContentDropped(content)"
 *      on-drop-content-list.call="ContentListDropped(contentList)"
 *      on-drop-content-on-item.call="ContentDroppedOnItem(content, item)"
 *      on-drop-content-list-on-item.call="ContentListDroppedOnItem(contentList, item)"
 *      view-type.bind="ViewType"
 *      query.bind='query'
 *      selection.two-way="SelectedContent"
 *      on-action.call="onAction(content, action)"></content-list>
 * ```
 */
@customElement("content-list")
@autoinject
export class ContentList {

    protected readonly selectionChangedSignalKey = "content-list-selection-changed";
    private eventHub: EventHub;
    constructor(
        private readonly repository: Repository,
        private readonly bindingSignaler: BindingSignaler,
    ) {
        this.eventHub = new EventHub(this.repository);
    }

    @bindable
    public isLoading: boolean = false;

    @bindable
    public scope!: IContent;

    @bindable
    public scopeHistory: IContent[] = [];

    @bindable
    public selection: IContent[] = [];

    @computedFrom("scope")
    get hasScope(): boolean {
        return this.scope && this.scope.Id && this.scope.Path && true || false;
    }

    @computedFrom("scope")
    get hasParent(): boolean {
        return this.hasScope && this.scope.Path.split("/").filter((p) => p && p.length).length > 1;
    }

    @bindable
    public query?: Query<IContent>;

    private observers: IDisposable[] = [];

    public disposeObservers() {
        this.observers.forEach((subscription) => {
            subscription.dispose();
        });
        this.observers = [];
    }

    public detached() {
        this.disposeObservers();
    }

    @bindable
    public getItems!: (params: { scope: IContent, query?: Query<IContent> }) => Promise<IContent[]>;

    @bindable
    public onActivate!: (params: { content: IContent }) => void;

    @bindable
    public onAction!: (params: { content: IContent, action: IActionModel }) => void; // { name: string; action: (content: Content) => void }[] = [];

    @bindable
    public onDropFiles: (params: { event: DragEvent, files: FileList }) => void = (params) => {
        /** */
    }

    @bindable
    public onDropContent: (params: { event: DragEvent, content: IContent }) => void = (params: { content: IContent }) => {
        if (this.scope.Path && this.scope.Path !== PathHelper.getParentPath(params.content.Path) && this.scope.Path !== params.content.Path && !PathHelper.isAncestorOf(params.content.Path, this.scope.Path)) {
            this.repository.move({
                idOrPath: params.content.Id,
                targetPath: this.scope.Path,
            });
        }
    }

    @bindable
    public onDropContentOnItem: (params: { event: DragEvent, content: IContent, item: IContent }) => void = (params) => {
        if (params.item.Path && params.item.Path !== PathHelper.getParentPath(params.content.Path) && params.item.Path !== params.content.Path && !PathHelper.isAncestorOf(params.content.Path, this.scope.Path)) {
            this.repository.move({
                idOrPath: params.item.Path,
                targetPath: this.scope.Path,
            });
        }
    }

    @bindable
    public onDropContentList: (params: { event: DragEvent, contentList: IContent[] }) => void = (params) => {
        if (this.scope.Path) {
            params.contentList.forEach((c) => this.onDropContent({ content: c, event: params.event }));
        }
    }

    public onDropFilesOnItem: (params: { files: FileList, item: IContent, event: DragEvent }) => void = (params) => {
        /** */
    }

    @bindable
    public onDropContentListOnItem: (params: { contentList: IContent[], item: IContent, event: DragEvent }) => void = (params) => {
        if (this.scope.Path) {
            params.contentList.forEach((c) => this.onDropContentOnItem({ content: c, item: params.item, event: params.event }));
        }
    }

    public triggerAction(event: MouseEvent, action: IActionModel, item: IContent) {
        event.stopPropagation();
        this.onAction({ content: item, action });
    }

    @bindable
    public viewType: CollectionView = CollectionView.List;

    @bindable
    public showScope: boolean = true;

    @bindable
    public multiSelect: boolean = true;

    @bindable
    public enableSelection: boolean = true;

    @bindable()
    public lastSelectionIndex!: number;

    @bindable
    public getActions: (params: { content: IContent }) => IActionModel[] = (params) => {
        return [];
    }

    public activateItem(content: IContent) {
        this.onActivate && this.onActivate({ content });
    }

    public selectItem(event: MouseEvent, content: IContent) {

        if (!this.enableSelection) {
            return;
        }

        this.lastSelectionIndex = this.items.indexOf(content);
        const selectionIndex = this.selection.indexOf(content);

        if (this.multiSelect && (event.ctrlKey || event.shiftKey)) {
            // CTRL+Click - Add/Remove toggle to Selection
            if (event.ctrlKey) {
                this.toggleSelection(event, content);
                return;
            }

            // SHIFT+Click - Select Range
            if (event.shiftKey) {
                const lastSelected = this.selection[this.selection.length - 1];
                const selectedIndex1 = this.items.indexOf(lastSelected) + 1;
                const selectedIndex2 = this.items.indexOf(content) + 1;

                const minSelected = Math.min(selectedIndex1, selectedIndex2) - 1;
                const maxSelected = Math.max(selectedIndex1, selectedIndex2);

                this.items.slice(minSelected, maxSelected).forEach((item) => {
                    if (selectionIndex === -1) {
                        this.selection.push(item);
                    }
                });
            }
        } else {
            this.selection = [content];
        }
        this.bindingSignaler.signal(this.selectionChangedSignalKey);
    }

    public toggleSelection(event: MouseEvent, content: IContent) {

        event.preventDefault();
        event.stopImmediatePropagation();
        if (!this.multiSelect) {
            this.selectItem(event, content);
            return;
        }

        const tempSelection = this.selection.map((s) => s);

        const index = tempSelection.indexOf(content);
        if (index === -1) {
            tempSelection.push(content);
        } else {
            tempSelection.splice(index, 1);
        }
        this.selection = tempSelection;
        setTimeout(() => {
            this.bindingSignaler.signal(this.selectionChangedSignalKey);
        });
    }

    public isSelected(content: IContent): boolean {
        return this.selection && this.selection.indexOf(content) !== -1;
    }

    public async reinitialize() {

        if (this.isLoading) {
            // already triggered
            return;
        }
        this.selection = [];
        this.isLoading = true;
        this.disposeObservers();

        if (this.hasScope) {
            /** ToDo */
            this.observers.push(this.eventHub.onContentCreated.subscribe((created) => this.handleContentChanges(created.content)));
            this.observers.push(this.eventHub.onContentDeleted.subscribe((deleted) => this.handleContentChanges(deleted.contentData)));
            this.observers.push(this.eventHub.onContentModified.subscribe((mod) => this.handleContentChanges(mod.content)));
            this.observers.push(this.eventHub.onContentMoved.subscribe((move) => this.handleContentChanges(move.content)));
        }

        try {
            const newItems = await this.getItems({ scope: this.scope, query: this.query });
            this.items = newItems;
        } catch (error) {
            /** */
        }
        this.isLoading = false;
    }

    public scopeChanged(newScope: IContent, lastScope: IContent) {
        this.scopeHistory.push(lastScope);
        this.reinitialize();
    }

    public queryChanged() {
        this.reinitialize();
    }

    @bindable
    public items!: IContent[];

    public itemsChanged() {
        const lastItem = this.scopeHistory[this.scopeHistory.length - 1];
        const lastSelectedIndex = this.items.indexOf(lastItem);
        if (lastSelectedIndex !== -1) {
            this.lastSelectionIndex = lastSelectedIndex;
        } else {
            this.lastSelectionIndex = this.hasParent ? -1 : 0;
        }

        this.bindingSignaler.signal(this.selectionChangedSignalKey);
    }

    @bindable
    public reloadOnContentChange: (change: IContent) => boolean =
        (content: IContent) => {
            return true;
            // ToDo: check this based on scope and Query
            // return (this.Query !== undefined)  || this.hasScope && ( isContent(content) && this.Scope.IsAncestorOf(content as Content)) || (content.Path && this.Scope.IsAncestorOf(content as any)) || false;
        }

    public handleContentChanges(...changes: IContent[]) {
        changes.forEach((change) => {
            if (this.reloadOnContentChange(change)) {
                this.reinitialize();
                return;
            }
        });
        return;
    }

    public dropContent(event: DragEvent, stringifiedContent: string, stringifiedContentList?: string[], files?: FileList) {
        if (stringifiedContent) {
            const droppedContent = JSON.parse(stringifiedContent);
            this.onDropContent({ event, content: droppedContent });
        }
        if (stringifiedContentList) {
            const contentList = stringifiedContentList.map((c) => JSON.parse(c));
            this.onDropContentList({ event, contentList });
        }

        if (files) {
            this.onDropFiles({ event, files });
        }
    }

    public dropContentOnItem(event: DragEvent, item: IContent, stringifiedContent?: string, stringifiedContentList?: string[], files?: FileList) {
        if (stringifiedContent) {
            const droppedContent = JSON.parse(stringifiedContent);
            this.onDropContentOnItem({ event, content: droppedContent, item });
        }
        if (stringifiedContentList) {
            const contentList = stringifiedContentList.map((c) => JSON.parse(c));
            this.onDropContentListOnItem({ event, contentList, item });
        }

        if (files) {
            this.onDropFilesOnItem({ event, files, item });
        }
    }

    public isFocused(content: IContent): boolean {
        return this.lastSelectionIndex === this.items.indexOf(content);
    }

    public focusIn() {
        // console.log("Focused In");
    }

    public focusOut() {
        // console.log("Focused out");
    }

    public selectAll() {
        this.selection = this.items;
        this.bindingSignaler.signal(this.selectionChangedSignalKey);
    }

    public clearSelection() {
        this.selection = [];
        this.bindingSignaler.signal(this.selectionChangedSignalKey);
    }

    public handleKeyPress(event: KeyboardEvent) {
        switch (event.key) {
            case "ArrowUp":
                if (this.hasParent && this.lastSelectionIndex > -1 || this.lastSelectionIndex > 0) {
                    this.lastSelectionIndex--;
                    this.bindingSignaler.signal(this.selectionChangedSignalKey);
                }
                break;
            case "Insert":
                if (this.enableSelection) {
                    const selectionIndex = this.selection.indexOf(this.items[this.lastSelectionIndex]);
                    if (selectionIndex === -1) {
                        this.selection.push(this.items[this.lastSelectionIndex]);
                    } else {
                        this.selection.splice(selectionIndex, 1);
                    }
                }
            case "ArrowDown":
                if (this.lastSelectionIndex < this.items.length - 1) {
                    this.lastSelectionIndex++;
                }
                this.bindingSignaler.signal(this.selectionChangedSignalKey);
                break;
            case "Enter":
                if (this.items[this.lastSelectionIndex]) {
                    this.activateItem(this.items[this.lastSelectionIndex]);
                } else {
                    this.activateItem(this.scope);
                }
                break;
            case " ": {
                if (this.enableSelection && this.items[this.lastSelectionIndex]) {
                    this.toggleSelection(event as any, this.items[this.lastSelectionIndex]);
                }
                this.bindingSignaler.signal(this.selectionChangedSignalKey);
                break;
            }
            case "Backspace":
                this.hasParent && this.activateItem(this.scope);
                break;
            case "a":
                if (event.ctrlKey) {
                    this.selectAll();
                }
                break;
            case "Escape":
                this.clearSelection();
                break;
            case "Home":
                this.lastSelectionIndex = this.hasParent ? -1 : 0;
                this.bindingSignaler.signal(this.selectionChangedSignalKey);
                break;
            case "End":
                this.lastSelectionIndex = this.items.length - 1;
                this.bindingSignaler.signal(this.selectionChangedSignalKey);
                break;
            default:
                return true;
        }
        event.stopImmediatePropagation();
        event.preventDefault();
        return false;
    }
}
