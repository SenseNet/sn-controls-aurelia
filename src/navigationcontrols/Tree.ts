/**
 * @module NavigationControls
 * 
 */ /** */

import { AureliaBaseControl } from '../AureliaBaseControl';
import { bindable, computedFrom, autoinject } from 'aurelia-framework';
import { Content, Repository, IContentOptions } from 'sn-client-js';
import { Subscription } from '@reactivex/rxjs';
import { DragTypes } from '../Enums';
import { Observable } from '@reactivex/rxjs';

/**
 * A tree with bindable Root content and Selection.
 * Usage example: 
 * ``` html
 * <tree content.bind="RootContent" selection.two-way="SelectionContent"></tree>
 * ```
 */
@autoinject
export class Tree extends AureliaBaseControl {

    Subscriptions: Subscription[] = [];

    @computedFrom('Content')
    get Repository(): Repository.BaseRepository {
        return this.Content['repository'];
    };

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
    get hasValidContent(): boolean{
        return this.Content && this.Content.options && Object.keys(this.Content.SavedFields).length > 0;
    }

    /**
     * Triggers an Expand on the current level (also used to load Children content)
     */
    async Expand(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.IsExpanded = true;
            this.IsLoading = true;

            this.Content.Children({
                metadata: 'no',
                select: ['Path', 'Id', 'Name', 'DisplayName', 'Icon'],
                orderby: 'DisplayName, Name'
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
        // const ordered = _.orderBy(this.Children, ['DisplayName', 'Name']).map(c => c);
        // this.Children = ordered;

        // ToDo

        this.HasChildren = this.Children.length > 0;
    }

    ContentChanged() {
        this.clearSubscriptions();

        if (!this.hasValidContent) {
            return;
        }
        this.Subscriptions.push(this.Repository.Events.OnContentCreated.subscribe(created => this.handleContentCreated(created.Content)));
        this.Subscriptions.push(this.Repository.Events.OnContentDeleted.subscribe(deleted => this.handleContentDeleted(deleted.ContentData)));
        this.Subscriptions.push(this.Repository.Events.OnContentModified.subscribe(mod => this.handleContentModified(mod.Content)));
        this.Subscriptions.push(this.Repository.Events.OnContentMoved.subscribe(move => this.handleContentMoved(move.Content, move.From, move.To)));
    }

    handleContentCreated(createdContent: Content){
        if (this.IsExpanded && !this.IsLoading && createdContent.IsChildOf(this.Content)) {
            this.Children.push(createdContent)
            this.ReorderChildren();
        }
    }

    handleContentDeleted(deletedContentData: IContentOptions){
        const child = this.Children.find(c => c.Id === deletedContentData.Id);
        if (this.IsExpanded && !this.IsLoading && child) {
            this.Children[this.Children.indexOf(child)] = undefined as any;
        }
    }

    handleContentModified(modifiedContent: Content){
        if (this.IsExpanded && !this.IsLoading && this.Children.find(c => c != null && c.Id === modifiedContent.Id)) {
            this.ReorderChildren();
        }
    }

    handleContentMoved(content: Content, from: string, to: string): Observable<Content>{
        const child = this.Children.find(c => c.Id === content.Id);

        if (this.IsExpanded && child) {
            this.Children.splice(this.Children.indexOf(child), 1);
            return Observable.of(child);
        }

        if (to === this.Content.Path) {
            if (this.IsExpanded) {
                this.IsLoading = true;
                const request = this.Repository.Load(content.Id || content.Path || '', { select: 'all' });
                request.subscribe(c => {
                    this.Children.push(c);
                    this.IsLoading = false;
                }, err => {
                    this.IsLoading = false;
                })

                return request;
            }
        }
        return Observable.of(content);
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

    dragStart(ev: DragEvent) {
        ev.stopPropagation();
        ev.dataTransfer.setData(DragTypes.Content, this.Content.Stringify());
        ev.dataTransfer.dropEffect = 'move';
        console.log('dragStart', this.Content.Path);
        return true;
    }
    dragEnd(ev: DragEvent) {
        ev.preventDefault();
        ev.stopPropagation();
        console.log('dragEnd', this.Content.Path);
    }

    dragEnter(ev: DragEvent) {
        ev.preventDefault();
        ev.stopPropagation();
        // console.log('dragEnter', this.Content.Path);
    }

    dragOver(ev: DragEvent) {
        ev.preventDefault();
        ev.stopPropagation();
       
        console.log('dragOver', this.Content.Path);
        return true;
    }

    dragDrop(ev: DragEvent) {
        ev.preventDefault();
        ev.stopPropagation();
        if (ev.dataTransfer.types.filter(d => d === DragTypes.Content) && this.Content.Path) {
            const droppedContent = this.Repository.ParseContent(ev.dataTransfer.getData(DragTypes.Content));
            if (this.Content.Path !== droppedContent.ParentPath && this.Content.Path !== droppedContent.Path && !droppedContent.IsAncestorOf(this.Content)){
                droppedContent.MoveTo(this.Content.Path);
            }
        }
        return true;
    }
}