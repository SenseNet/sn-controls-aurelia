import { bindable, computedFrom, customElement } from 'aurelia-framework';
import { Content, Query, Repository, IContentOptions } from 'sn-client-js';
import { AureliaBaseControl } from '../AureliaBaseControl';
import { Subscription } from '@reactivex/rxjs';

export enum CollectionView {
    List = 'List',
    Grid = 'Grid',
    Details = 'Details',

}

@customElement('content-list')
export class ContentList extends AureliaBaseControl {

    @bindable
    public IsLoading: boolean = false;

    @bindable
    public Scope: Content;

    @computedFrom('Scope')
    get hasScope(): boolean{
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
    public GetItems: (params: {scope: Content, query?: Query}) => Promise<Content[]>;

    @bindable
    public OnActivate: (params: {content: Content}) => void;

    activateItem(content: Content){
        this.OnActivate && this.OnActivate({content: content});
    }

    public async Reinitialize() {

        if (this.IsLoading){
            // already triggered
            return;
        }

        this.IsLoading = true;
        this.clearSubscriptions();

        if (this.hasScope) {
            this.Subscriptions.push(this.Repository.Events.OnContentCreated.subscribe(created => this.handleContentChanges(created.Content)));
            this.Subscriptions.push(this.Repository.Events.OnContentDeleted.subscribe(deleted => this.handleContentChanges(deleted.ContentData)));
            this.Subscriptions.push(this.Repository.Events.OnContentModified.subscribe(mod => this.handleContentChanges(mod.Content)));
            this.Subscriptions.push(this.Repository.Events.OnContentMoved.subscribe(move => this.handleContentChanges(move.Content, {Path: move.From}, {Path: move.To})));
        }

        try {
            const newItems = await this.GetItems({scope: this.Scope, query: this.Query});
            this.Items = newItems;
        } catch (error) {

        }
        this.IsLoading = false;
    }

    ScopeChanged(){
        this.Reinitialize();
    };
    QueryChanged = () => this.Reinitialize();

    @bindable
    public Items: Content[];

    @bindable
    public ReloadOnContentChange: (change: Content | IContentOptions) => boolean = 
        (content) => {
            return true;
            // ToDo: check this based on scope and Query
            // return this.hasScope && ( isContent(content) && this.Scope.IsAncestorOf(content)) || (content.Path && this.Scope.IsAncestorOf(content as any)) || false;
        }

    handleContentChanges(...changes: (Content|IContentOptions)[]){
        changes.forEach(change => {
            if (this.ReloadOnContentChange(change)){
                this.Reinitialize();
                return;
            }
        });
        return;
    }

    dropContent(stringifiedContent: string){
        const droppedContent = this.Repository.ParseContent(stringifiedContent);
        if (this.Scope.Path && this.Scope.Path !== droppedContent.ParentPath && this.Scope.Path !== droppedContent.Path && !droppedContent.IsAncestorOf(this.Scope)){
                droppedContent.MoveTo(this.Scope.Path);
        }
    }

    /**
     * 
     *  Options:
     *      - View (List, Grid, Details, Tree??)
     *      - Floating (autocomplete)
     *      - Search term
     *  Events
     */
}