/**
 * @module NavigationControls
 * 
 */ /** */

import { bindable, computedFrom, autoinject } from 'aurelia-framework';
import { Content, Repository } from 'sn-client-js';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

/**
 * A tree with bindable Root content and Selection.
 * Usage example: 
 * ``` html
 * <tree content.bind="RootContent" selection.two-way="SelectionContent"></tree>
 * ```
 */
@autoinject
export class Tree {


    Subscriptions: Subscription[] = [];

    @computedFrom('Content')
    get Repository(): Repository.BaseRepository {
        return this.Content.GetRepository();
    };

    @bindable
    public NestingLevel: number = 0;

    /**
     * Property that represents if the tree is expanded or not
     */
    @bindable
    IsExpanded: boolean = false;

    /**
     * Property that represents if the tree is currently loading it's child content
     */
    @bindable
    IsLoading: boolean = false;

    /**
     * Property that represents of the tree has children or not
     */

    @bindable
    HasChildren: boolean = true;

    /**
     * The root level Content instance of the tree
     */

    @bindable
    Content: Content;

    /**
     * List of the child content (will be reloaded on each expand)
     */
    @bindable
    Children: Content[] = [];


    /**
     * An optional Content that represents the current Selection for the Tree. Used for auto-expand and Selection binding
     */
    @bindable
    Selection: Content;

    /**
     * indicates if the current level Content is selected in the Tree. This getter is also used for auto-expand
     */
    @computedFrom('Selection', 'Content')
    get IsSelected() {
        if (this.Selection && this.Selection.Path && this.Content && this.Content.Path) {
            if (!this.IsExpanded && this.Selection.Path.indexOf(this.Content.Path + '/') === 0 && this.Selection.Path !== this.Content.Path) {
                this.Expand();
            }
            return this.Selection.Path === this.Content.Path;
        }
        return false;
    }

    @computedFrom('Content')
    get hasValidContent(): boolean {
        return this.Content && this.Content.SavedFields && Object.keys(this.Content.SavedFields).length > 0;
    }

    /**
     * Triggers an Expand on the current level (also used to load Children content)
     */
    @bindable
    Expand: () => Promise<void> = () => {
        return new Promise<void>((resolve, reject) => {
            this.IsExpanded = true;
            this.IsLoading = true;

            this.Content.Children({
                metadata: 'no',
                expand: ['Workspace'],
                select: ['Path', 'Id', 'Name', 'DisplayName', 'Icon', 'IsFolder'],
                orderby: ['DisplayName', 'Name'],
                filter: 'IsFolder'
            }).subscribe(children => {
                setTimeout(() => {
                    this.Children = children;
                    this.ReorderChildren();
                    resolve();
                }, 200)
                this.IsLoading = false;
            }, (err) => {
                this.IsLoading = false;
                reject(err);
            });
        });
    }

    /**
     * Triggers a Collapse operation (hide children)
     */
    Collapse() {
        this.IsExpanded = false;
    }

    /**
     * Toggles between Expand / Collapse
     */
    Toggle() {
        !this.IsLoading && (!this.IsExpanded ? this.Expand() : this.Collapse());
    }

    /**
     * Sets the Selection to the current level Content
     */
    Select() {
        this.Selection = this.Content;
    }

    ReorderChildren() {
        this.Children = this.Children.sort((a, b) => {
            let x: string = a['DisplayName'] || a['Name'] || '';
            let y: string = b['DisplayName'] || b['Name'] || '';
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
        this.HasChildren = this.Children.length > 0;
    }

    ContentChanged() {
        this.clearSubscriptions();

        if (!this.hasValidContent) {
            return;
        }

        this.Subscriptions.push(this.Repository.Events.OnContentCreated.subscribe(created => this.handleContentCreated(created)));
        this.Subscriptions.push(this.Repository.Events.OnContentDeleted.subscribe(deleted => this.handleContentDeleted(deleted)));
        this.Subscriptions.push(this.Repository.Events.OnContentModified.subscribe(mod => this.handleContentModified(mod)));
        this.Subscriptions.push(this.Repository.Events.OnContentMoved.subscribe(move => this.handleContentMoved(move)));

    }

    handleContentCreated(created: Repository.EventModels.Created) {
        if (this.IsExpanded && !this.IsLoading && created.Content.IsChildOf(this.Content)) {
            this.Children.push(created.Content)
            this.ReorderChildren();
        }
    }

    handleContentDeleted(deleted: Repository.EventModels.Deleted) {
        const child = this.Children.find(c => c.Id === deleted.ContentData.Id);
        if (this.IsExpanded && !this.IsLoading && child) {
            this.Children = this.Children.filter(c => c !== child);
        }
    }

    handleContentModified(modified: Repository.EventModels.Modified) {
        if (this.IsExpanded && !this.IsLoading && this.Children.find(c => c != null && c.Id === modified.Content.Id)) {
            this.ReorderChildren();
        }
    }

    handleContentMoved(moved: Repository.EventModels.ContentMoved): Observable<Content> {
        const child = this.Children.find(c => c.Id === moved.Content.Id);

        if (this.IsExpanded && child) {
            this.Children = this.Children.filter(c => c !== child);
            return Observable.of(child);
        }

        if (moved.To === this.Content.Path) {
            if (this.IsExpanded) {
                this.IsLoading = true;
                const request = this.Repository.Load(moved.Content.Id || moved.Content.Path || '', { select: 'all' });
                request.subscribe(c => {
                    if (c.IsFolder){
                        this.Children.push(c);
                    }
                    this.IsLoading = false;
                    this.ReorderChildren();
                }, err => {
                    this.IsLoading = false;
                })

                return request;
            }
        }
        return Observable.of(moved.Content);
    }

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
    public OnDropContent: (params: {event: DragEvent, content: Content}) => void = (params: {content: Content}) => {
        if (this.Content.Path && this.Content.Path !== params.content.ParentPath && this.Content.Path !== params.content.Path && !params.content.IsAncestorOf(this.Content)) {
            params.content.MoveTo(this.Content.Path);
        }
    }

    @bindable
    public OnDropContentList: (params: {event: DragEvent, contentList: Content[]}) => void = (params) => {
        if (this.Content.Path){
            if (params.event.ctrlKey){
                this.Repository.CopyBatch(params.contentList, this.Content.Path);
            } else {
                this.Repository.MoveBatch(params.contentList, this.Content.Path);
            }
        }
    };

    @bindable 
    public OnDropFiles: (params: {event: DragEvent, files: FileList}) => void = (params) => {

    };    

    async dropContent(event: DragEvent, stringifiedContent: string, stringifiedContentList?: string[], files?: FileList) {

        if (stringifiedContent){
            const droppedContent = this.Repository.ParseContent(stringifiedContent);
            this.OnDropContent({event, content: droppedContent});
        }
        if (stringifiedContentList){
            const contentList = stringifiedContentList.map(c => this.Repository.ParseContent(c))
            this.OnDropContentList({event, contentList});
        }

        if (files){
            this.OnDropFiles({event, files});
        }
    }
}