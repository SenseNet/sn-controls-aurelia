/**
 * @module CollectionControls
 * 
 * */ /** */


import { bindable, computedFrom, customElement, autoinject } from 'aurelia-framework';
import { Content, Query, Repository, IContent } from 'sn-client-js';
import { Subscription } from 'rxjs/Subscription';
import { BindingSignaler } from 'aurelia-templating-resources';
import { ActionModel } from 'sn-client-js/dist/src/Repository';

export enum CollectionView {
    List = 'List',
    Grid = 'Grid',
    Details = 'Details',
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
@customElement('content-list')
@autoinject
export class ContentList {

    protected readonly selectionChangedSignalKey = 'content-list-selection-changed';
    constructor(
        private readonly bindingSignaler: BindingSignaler
    ) {
    }

    @bindable
    public IsLoading: boolean = false;

    @bindable
    public Scope: Content;

    @bindable
    public ScopeHistory: Content[] = [];

    @bindable
    public Selection: Content[] = [];

    @computedFrom('Scope')
    get hasScope(): boolean {
        return this.Scope && this.Scope.SavedFields && Object.keys(this.Scope.SavedFields).length > 0 || false;
    }

    @computedFrom('Scope')
    get hasParent(): boolean {
        return this.hasScope && this.Scope.Path.split('/').filter(p => p && p.length).length > 1;
    }

    @bindable
    public Query?: Query;

    private Subscriptions: Subscription[] = [];

    @computedFrom('Scope')
    get Repository(): Repository.BaseRepository {
        return this.Scope.GetRepository();
    };

    clearSubscriptions() {
        this.Subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        this.Subscriptions = [];
    }

    detached() {
        this.clearSubscriptions();
    }

    @bindable
    public GetItems: (params: { scope: Content, query?: Query }) => Promise<Content[]>;

    @bindable
    public OnActivate: (params: { content: Content }) => void;

    @bindable
    public OnAction: (params: { content: Content, action: ActionModel }) => void; //{ name: string; action: (content: Content) => void }[] = [];

    @bindable
    public OnDropFiles: (params: { event: DragEvent, files: FileList }) => void = (params) => {
    };

    @bindable
    public OnDropContent: (params: { event: DragEvent, content: Content }) => void = (params: { content: Content }) => {
        if (this.Scope.Path && this.Scope.Path !== params.content.ParentPath && this.Scope.Path !== params.content.Path && !params.content.IsAncestorOf(this.Scope)) {
            params.content.MoveTo(this.Scope.Path);
        }
    }


    @bindable
    public OnDropContentOnItem: (params: { event: DragEvent, content: Content, item: Content }) => void = (params) => {
        if (params.item.Path && params.item.Path !== params.content.ParentPath && params.item.Path !== params.content.Path && !params.content.IsAncestorOf(params.item)) {
            params.content.MoveTo(params.item.Path);
        }
    }

    @bindable
    public OnDropContentList: (params: { event: DragEvent, contentList: Content[] }) => void = (params) => {
        if (this.Scope.Path) {
            params.contentList.forEach(c => this.OnDropContent({ content: c, event: params.event }));
        }
    };

    public OnDropFilesOnItem: (params: { files: FileList, item: Content, event: DragEvent, }) => void = (params) => {
        console.log('Dropped files on item', params);
    };


    @bindable
    public OnDropContentListOnItem: (params: { contentList: Content[], item: Content, event: DragEvent, }) => void = (params) => {
        if (this.Scope.Path) {
            params.contentList.forEach(c => this.OnDropContentOnItem({ content: c, item: params.item, event: params.event }));
        }
    };

    public triggerAction(event: MouseEvent, action: ActionModel, item: Content) {
        event.stopPropagation();
        this.OnAction({content: item, action});
    }

    @bindable
    ViewType: CollectionView = CollectionView.List;

    @bindable
    ShowScope: boolean = true;

    @bindable
    MultiSelect: boolean = true;

    @bindable
    EnableSelection: boolean = true;

    @bindable()
    LastSelectionIndex: number;

    @bindable
    public GetActions: (params: { content: Content }) => ActionModel[] = (params) => {
        return [];
    }

    activateItem(content: Content) {
        this.OnActivate && this.OnActivate({ content: content });
    }

    selectItem(event: MouseEvent, content: Content) {

        if (!this.EnableSelection) {
            return;
        }

        this.LastSelectionIndex = this.Items.indexOf(content);
        const selectionIndex = this.Selection.indexOf(content);

        if (this.MultiSelect && (event.ctrlKey || event.shiftKey)) {
            // CTRL+Click - Add/Remove toggle to Selection
            if (event.ctrlKey) {
                this.toggleSelection(event, content);
                return;
            }

            // SHIFT+Click - Select Range
            if (event.shiftKey) {
                const lastSelected = this.Selection[this.Selection.length - 1];
                const selectedIndex1 = this.Items.indexOf(lastSelected) + 1;
                const selectedIndex2 = this.Items.indexOf(content) + 1;

                const minSelected = Math.min(selectedIndex1, selectedIndex2) - 1;
                const maxSelected = Math.max(selectedIndex1, selectedIndex2);

                this.Items.slice(minSelected, maxSelected).forEach(item => {
                    if (selectionIndex === -1) {
                        this.Selection.push(item);
                    }
                })
            }
        } else {
            this.Selection = [content];
        }
        this.bindingSignaler.signal(this.selectionChangedSignalKey);
    }

    toggleSelection(event: MouseEvent, content: Content) {

        event.preventDefault()
        event.stopImmediatePropagation();
        if (!this.MultiSelect) {
            this.selectItem(event, content);
            return;
        }

        const tempSelection = this.Selection.map(s => s);

        const index = tempSelection.indexOf(content);
        if (index === -1) {
            tempSelection.push(content);
        } else {
            tempSelection.splice(index, 1);
        }
        this.Selection = tempSelection;
        setTimeout(() => {
            this.bindingSignaler.signal(this.selectionChangedSignalKey);
        });
    }

    isSelected(content: Content): boolean {
        return this.Selection && this.Selection.indexOf(content) !== -1;
    }

    public async Reinitialize() {

        if (this.IsLoading) {
            // already triggered
            return;
        }
        this.Selection = [];
        this.IsLoading = true;
        this.clearSubscriptions();

        if (this.hasScope) {
            this.Subscriptions.push(this.Repository.Events.OnContentCreated.subscribe(created => this.handleContentChanges(created.Content)));
            this.Subscriptions.push(this.Repository.Events.OnContentDeleted.subscribe(deleted => this.handleContentChanges(deleted.ContentData)));
            this.Subscriptions.push(this.Repository.Events.OnContentModified.subscribe(mod => this.handleContentChanges(mod.Content)));
            this.Subscriptions.push(this.Repository.Events.OnContentMoved.subscribe(move => this.handleContentChanges(move.Content, { Path: move.From }, { Path: move.To })));
        }

        try {
            const newItems = await this.GetItems({ scope: this.Scope, query: this.Query });
            this.Items = newItems;
        } catch (error) {

        }
        this.IsLoading = false;
    }

    ScopeChanged(newScope: Content, lastScope: Content) {
        this.ScopeHistory.push(lastScope);
        this.Reinitialize();
    };

    QueryChanged() {
        this.Reinitialize()
    };

    @bindable
    public Items: Content[];


    public ItemsChanged() {
        const lastItem = this.ScopeHistory[this.ScopeHistory.length - 1];
        const lastSelectedIndex = this.Items.indexOf(lastItem);
        if (lastSelectedIndex !== -1) {
            this.LastSelectionIndex = lastSelectedIndex;
        } else {
            this.LastSelectionIndex = this.hasParent ? -1 : 0;
        }


        this.bindingSignaler.signal(this.selectionChangedSignalKey);
    }

    @bindable
    public ReloadOnContentChange: (change: Content | IContent) => boolean =
        (content: Content | IContent) => {
            return true;
            // ToDo: check this based on scope and Query
            // return (this.Query !== undefined)  || this.hasScope && ( isContent(content) && this.Scope.IsAncestorOf(content as Content)) || (content.Path && this.Scope.IsAncestorOf(content as any)) || false;
        }

    handleContentChanges(...changes: (Content | IContent)[]) {
        changes.forEach(change => {
            if (this.ReloadOnContentChange(change)) {
                this.Reinitialize();
                return;
            }
        });
        return;
    }

    dropContent(event: DragEvent, stringifiedContent: string, stringifiedContentList?: string[], files?: FileList) {
        if (stringifiedContent) {
            const droppedContent = this.Repository.ParseContent(stringifiedContent);
            this.OnDropContent({ event, content: droppedContent });
        }
        if (stringifiedContentList) {
            const contentList = stringifiedContentList.map(c => this.Repository.ParseContent(c))
            this.OnDropContentList({ event, contentList });
        }

        if (files) {
            this.OnDropFiles({ event, files });
        }
    }

    dropContentOnItem(event: DragEvent, item: Content, stringifiedContent?: string, stringifiedContentList?: string[], files?: FileList) {
        if (stringifiedContent) {
            const droppedContent = this.Repository.ParseContent(stringifiedContent);
            this.OnDropContentOnItem({ event, content: droppedContent, item });
        }
        if (stringifiedContentList) {
            const contentList = stringifiedContentList.map(c => this.Repository.ParseContent(c))
            this.OnDropContentListOnItem({ event, contentList, item });
        }

        if (files) {
            this.OnDropFilesOnItem({ event, files, item });
        }
    }


    isFocused(content: Content): boolean {
        return this.LastSelectionIndex === this.Items.indexOf(content);
    }

    focusIn() {
        console.log('Focused In');
    }

    focusOut() {
        console.log('Focused out')
    }

    selectAll(){
        this.Selection = this.Items;
        this.bindingSignaler.signal(this.selectionChangedSignalKey);        
    }

    clearSelection(){
        this.Selection = [];
        this.bindingSignaler.signal(this.selectionChangedSignalKey);               
    }

    handleKeyPress(event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowUp':
                if (this.hasParent && this.LastSelectionIndex > -1 || this.LastSelectionIndex > 0) {
                    this.LastSelectionIndex--;
                    this.bindingSignaler.signal(this.selectionChangedSignalKey);
                }
                break;
            case 'Insert':
                if (this.EnableSelection){
                    const selectionIndex = this.Selection.indexOf(this.Items[this.LastSelectionIndex]);
                    if (selectionIndex === -1) {
                        this.Selection.push(this.Items[this.LastSelectionIndex])
                    } else {
                        this.Selection.splice(selectionIndex, 1);
                    }
                }
            case 'ArrowDown':
                if (this.LastSelectionIndex < this.Items.length - 1) {
                    this.LastSelectionIndex++;
                }
                this.bindingSignaler.signal(this.selectionChangedSignalKey);                
                break;
            case 'Enter':
                if (this.Items[this.LastSelectionIndex]) {
                    this.activateItem(this.Items[this.LastSelectionIndex]);
                } else {
                    this.activateItem(this.Scope);
                }
                break;
            case ' ': {
                if (this.EnableSelection && this.Items[this.LastSelectionIndex])
                this.toggleSelection(event as any, this.Items[this.LastSelectionIndex]);
                this.bindingSignaler.signal(this.selectionChangedSignalKey);
                break;
            }
            case 'Backspace':
                this.hasParent && this.activateItem(this.Scope);
                break;
            case 'a':
                if (event.ctrlKey){
                    this.selectAll();
                }
                break;
            case 'Escape':
                this.clearSelection();
                break;
            case 'Home':
                this.LastSelectionIndex = this.hasParent ? -1 : 0;
                this.bindingSignaler.signal(this.selectionChangedSignalKey);
                break;
            case 'End':
                this.LastSelectionIndex = this.Items.length - 1;
                this.bindingSignaler.signal(this.selectionChangedSignalKey);
                break;
            default:
                return true;
        }
        event.stopImmediatePropagation()
        event.preventDefault();
        return false;
    }
}