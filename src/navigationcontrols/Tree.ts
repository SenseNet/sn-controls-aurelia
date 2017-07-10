import { AureliaBaseControl } from '../AureliaBaseControl';
import { bindable, computedFrom } from 'aurelia-framework';
import { Content } from 'sn-client-js';

export class Tree extends AureliaBaseControl {

    @bindable
    IsExpanded: boolean = false;

    @bindable
    IsLoading: boolean = false;

    @bindable
    HasChildren: boolean = true;

    @bindable
    Content: Content;

    @bindable
    Children: Content[] = [];

    @bindable
    Selection: Content;

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

    async Expand(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.IsExpanded = true;
            this.IsLoading = true;

            this.Content.Children({
                metadata: 'no',
                select: ['Path', 'Id', 'Name', 'DisplayName', 'Icon']
            }).subscribe(children => {
                setTimeout(() => {
                    this.Children = children;
                    if (!this.Children.length) {
                        this.HasChildren = false;
                    } else {
                        this.HasChildren = true;
                    }
                    resolve();
                }, 200)
                this.IsLoading = false;
            }, (err) => {
                this.IsLoading = false;
                reject(err);
            });
        });
    }

    Collapse() {
        this.IsExpanded = false;
    }

    Toggle() {
        !this.IsLoading && (!this.IsExpanded ? this.Expand() : this.Collapse());
    }

    Select() {
        this.Selection = this.Content;
    }
}