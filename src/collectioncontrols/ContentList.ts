import { bindable, computedFrom, customElement, autoinject } from 'aurelia-framework';
import { Content, Query, Repository, IContentOptions } from 'sn-client-js';
import { Subscription } from '@reactivex/rxjs';
import { BindingSignaler } from 'aurelia-templating-resources';

export enum CollectionView {
    List = 'List',
    Grid = 'Grid',
    Details = 'Details',
}

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
    public Selection: Content[] = [];

    @computedFrom('Scope')
    get hasScope(): boolean {
        return this.Scope && this.Scope.options && Object.keys(this.Scope.SavedFields).length > 0 || false;
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
    public Actions: { name: string; action: (content: Content) => void }[] = [];

    public triggerAction(event: MouseEvent, action: (item: Content) => void, item: Content) {
        event.stopPropagation();
        action(item);
    }

    @bindable
    ViewType: CollectionView = CollectionView.List;

    @bindable
    ShowScope: boolean = true;

    @bindable
    MultiSelect: boolean = true;

    @bindable
    EnableSelection: boolean = true;

    activateItem(content: Content) {
        this.OnActivate && this.OnActivate({ content: content });
    }

    selectItem(event: MouseEvent, content: Content) {

        if (!this.EnableSelection) {
            return;
        }

        const selectionIndex = this.Selection.indexOf(content);

        if (this.MultiSelect && (event.ctrlKey || event.shiftKey)) {
            // CTRL+Click - Add/Remove toggle to Selection
            if (event.ctrlKey) {
                this.toggleSelection(event, content);
                return;
            }

            // SHIFT+Click - Select Range
            if (event.shiftKey){
                const lastSelected = this.Selection[this.Selection.length - 1];
                const selectedIndex1 = this.Items.indexOf(lastSelected) + 1;
                const selectedIndex2 = this.Items.indexOf(content) + 1;

                const minSelected = Math.min(selectedIndex1, selectedIndex2) - 1;
                const maxSelected = Math.max(selectedIndex1, selectedIndex2);

                this.Items.slice(minSelected, maxSelected).forEach(item => {
                    if (selectionIndex === -1){
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

        const index = this.Selection.indexOf(content);
        if (index === -1) {
            this.Selection.push(content);
        } else {
            this.Selection.splice(index, 1);
        }
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

    ScopeChanged() {
        this.Reinitialize();
    };
    
    QueryChanged(){
         this.Reinitialize()
    };

    @bindable
    public Items: Content[];

    @bindable
    public ReloadOnContentChange: (change: Content | IContentOptions) => boolean =
    (content) => {
        return true;
        // ToDo: check this based on scope and Query
        // return this.hasScope && ( isContent(content) && this.Scope.IsAncestorOf(content)) || (content.Path && this.Scope.IsAncestorOf(content as any)) || false;
    }

    handleContentChanges(...changes: (Content | IContentOptions)[]) {
        changes.forEach(change => {
            if (this.ReloadOnContentChange(change)) {
                this.Reinitialize();
                return;
            }
        });
        return;
    }

    dropContent(stringifiedContent: string) {
        const droppedContent = this.Repository.ParseContent(stringifiedContent);
        if (this.Scope.Path && this.Scope.Path !== droppedContent.ParentPath && this.Scope.Path !== droppedContent.Path && !droppedContent.IsAncestorOf(this.Scope)) {
            droppedContent.MoveTo(this.Scope.Path);
        }
    }
}