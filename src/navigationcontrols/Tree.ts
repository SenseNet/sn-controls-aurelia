/**
 * @module NavigationControls
 *
 */ /** */

import { IContent, Repository } from "@sensenet/client-core";
import { IDisposable, PathHelper, ValueObserver } from "@sensenet/client-utils";
import { GenericContent } from "@sensenet/default-content-types";
import { EventHub, IContentMoved, ICreated, IDeleted, IModified } from "@sensenet/repository-events";
import { autoinject, bindable, computedFrom } from "aurelia-framework";

/**
 * A tree with bindable Root Content and Selection.
 * Usage example:
 * ``` html
 * <tree content.bind="RootContent" selection.two-way="SelectionContent"></tree>
 * ```
 */
@autoinject
export class Tree {

    @bindable
    public childrenContainer!: HTMLElement;

    public observers: IDisposable[] = [];

    @bindable
    public nestingLevel: number = 0;

    /**
     * Property that represents if the tree is expanded or not
     */
    @bindable
    public isExpanded: boolean = false;

    /**
     * Property that represents if the tree is currently loading it's child IContent
     */
    @bindable
    public isLoading: boolean = false;

    /**
     * Property that represents of the tree has children or not
     */

    @bindable
    public hasChildren: boolean = true;

    /**
     * The root level IContent instance of the tree
     */

    @bindable
    public content!: IContent;

    /**
     * List of the child IContent (will be reloaded on each expand)
     */
    @bindable
    public children: GenericContent[] = [];

    /**
     * An optional IContent that represents the current Selection for the Tree. Used for auto-expand and Selection binding
     */
    @bindable
    public selection!: IContent;

    private readonly eventHub: EventHub;

    constructor(public repository: Repository) {
        this.eventHub = new EventHub(this.repository);
    }

    /**
     * indicates if the current level IContent is selected in the Tree. This getter is also used for auto-expand
     */
    @computedFrom("selection", "content")
    get isSelected() {
        if (this.selection && this.selection.Path && this.content && this.content.Path) {
            if (!this.isExpanded && this.selection.Path.indexOf(this.content.Path + "/") === 0 && this.selection.Path !== this.content.Path) {
                this.expand();
            }
            return this.selection.Path === this.content.Path;
        }
        return false;
    }

    @computedFrom("content")
    get hasValidContent(): boolean {
        return this.content ? true : false;
    }

    /**
     * Triggers an Expand on the current level (also used to load Children IContent)
     */
    @bindable
    public expand = async () => {
        this.isExpanded = true;
        this.isLoading = true;
        try {
            const children = await this.repository.loadCollection<GenericContent>({
                path: this.content.Path,
                oDataOptions: {
                    metadata: "no",
                    expand: ["Workspace"],
                    select: ["Path", "Id", "Name", "DisplayName", "Icon", "IsFolder"],
                    orderby: ["DisplayName", "Name"],
                    filter: "IsFolder",
                },
            });
            this.children = children.d.results;
        } catch {
            this.children = [];
        } finally {
            this.isLoading = false;
            this.reorderChildren();

            setTimeout(() => {
                if (this.childrenContainer) {
                    this.childrenContainer.style.maxHeight = "none";
                }
            }, 200);

        }
    }

    /**
     * Triggers a Collapse operation (hide children)
     */
    public collapse() {
        if (this.childrenContainer) {
            this.childrenContainer.style.removeProperty("max-height");
        }
        if (PathHelper.getParentPath(this.selection.Path) === this.content.Path) {
            this.selection = this.content;
        }
        setTimeout(() => {
            this.isExpanded = false;
        }, 10);
    }

    /**
     * Toggles between Expand / Collapse
     */
    public toggle() {
        !this.isLoading && (!this.isExpanded ? this.expand() : this.collapse());
    }

    /**
     * Sets the Selection to the current level IContent
     */
    public select() {
        this.selection = this.content;
    }

    public reorderChildren() {
        this.children = this.children.sort((a, b) => {
            const x: string = a.DisplayName || a.Name || "";
            const y: string = b.DisplayName || b.Name || "";
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
        this.hasChildren = this.children.length > 0;
    }

    public contentChanged() {
        this.disposeObservers();

        if (!this.hasValidContent) {
            return;
        }
        this.observers.push(this.eventHub.onContentCreated.subscribe((created) => this.handleContentCreated(created)));
        this.observers.push(this.eventHub.onContentDeleted.subscribe((deleted) => this.handleContentDeleted(deleted)));
        this.observers.push(this.eventHub.onContentModified.subscribe((mod) => this.handleContentModified(mod)));
        this.observers.push(this.eventHub.onContentMoved.subscribe((move) => this.handleContentMoved(move)));

    }

    public handleContentCreated(created: ICreated) {
        if (this.isExpanded && !this.isLoading && PathHelper.getParentPath(created.content.Path) === this.content.Path) {
            this.children.push(created.content);
            this.reorderChildren();
        }
    }

    public handleContentDeleted(deleted: IDeleted) {
        const child = this.children.find((c) => c.Id === deleted.contentData.Id);
        if (this.isExpanded && !this.isLoading && child) {
            this.children = this.children.filter((c) => c !== child);
        }
    }

    public handleContentModified(modified: IModified) {
        if (this.isExpanded && !this.isLoading && this.children.find((c) => c != null && c.Id === modified.content.Id)) {
            this.reorderChildren();
        }
    }

    public async handleContentMoved(moved: IContentMoved) {
        const child = this.children.find((c) => c.Id === moved.content.Id);

        if (this.isExpanded && child) {
            this.children = this.children.filter((c) => c !== child);
            return child;
        }

        if (moved.content.Path.indexOf(this.content.Path) === 0) {
            if (this.isExpanded) {
                this.isLoading = true;
                try {
                    const request = await this.repository.load<GenericContent>({
                        idOrPath: moved.content.Id || moved.content.Path || "",
                        oDataOptions: { select: "all" },
                    });
                    if (request.d.IsFolder) {
                        this.children.push(request.d);
                    }

                    return request.d;
                } finally {
                    this.isLoading = false;
                    this.reorderChildren();
                }

            }
        }
        return moved.content;
    }

    public disposeObservers() {
        this.observers.forEach((observer) => {
            observer.dispose();
        });
        this.observers = [];
    }

    public detached() {
        this.disposeObservers();
    }

    @bindable
    public onDropContent: (params: {event: DragEvent, content: IContent}) => Promise<any> = async (params: {content: IContent, event: DragEvent}) => {
        if (this.content.Path && this.content.Path !== PathHelper.getParentPath(params.content.Path)
        && this.content.Path !== params.content.Path && !PathHelper.isAncestorOf(this.content.Path, params.content.Path)) {
            this.isLoading = true;
            try {
                await this.repository.move({
                    targetPath: this.content.Path,
                    idOrPath: params.content.Id || params.content.Path,
                });
            } finally {
                this.isLoading = false;
            }
        }
    }

    @bindable
    public onDropContentList: (params: {event: DragEvent, contentList: IContent[]}) => Promise<void> = async (params) => {
        if (this.content.Path) {
            if (params.event.ctrlKey) {
                await this.repository.copy({
                    idOrPath: params.contentList.map((a) => a.Id || a.Path),
                    targetPath: this.content.Path,
                });
            } else {
                await this.repository.move({
                    idOrPath: params.contentList.map((a) => a.Id || a.Path),
                    targetPath: this.content.Path,
                });

            }
        }
    }

    @bindable
    public onDropFiles: (params: {event: DragEvent, files: FileList}) => Promise<void> = async (params) => {
        /** */
    }

    public async dropContent(event: DragEvent, stringifiedContent: string, stringifiedContentList?: string[], files?: FileList) {

        if (stringifiedContent) {
            const droppedContent = JSON.parse(stringifiedContent);
            await this.onDropContent({event, content: droppedContent});
        }
        if (stringifiedContentList) {
            const droppedContentList = stringifiedContentList.map((c) => JSON.parse(c));
            await this.onDropContentList({event, contentList: droppedContentList});
        }

        if (files) {
            await this.onDropFiles({event, files});
        }
    }
}
