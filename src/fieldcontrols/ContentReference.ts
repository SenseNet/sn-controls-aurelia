/**
 * @module FieldControls
 * 
 */ /** */

import { FieldBaseControl } from './FieldBaseControl';
import { FieldSettings, ContentReferenceField, SavedContent, QueryResult, IContent } from 'sn-client-js';
import { customElement, bindable } from 'aurelia-framework';
import { Observable } from 'rxjs/Observable';

@customElement('content-reference')
export class ContentReference extends FieldBaseControl<ContentReferenceField<IContent>, FieldSettings.ReferenceFieldSetting> {

    @bindable
    Item: SavedContent;

    @bindable
    public availableValues: SavedContent[] = [];


    @bindable
    public searchString: string = '';

    @bindable
    isOpened: boolean = false;

    @bindable
    isFocused: boolean = false;

    searchInput: HTMLInputElement;


    @bindable
    selectionIndex: number = 0;

    searchStringChanged(newValue: string): Observable<QueryResult> {
        const req = newValue && this.value && this.value.Search(newValue, 10, 0, { select: 'all' })
            .Exec();
        req && req.subscribe(res => {
            this.availableValues = res.Result.filter(a => a !== this.content);
            this.isOpened = true;
            this.selectionIndex = 0;
        }, err => {
        }) || (this.availableValues = []);
        return req || Observable.of<QueryResult>({Count: 0, Result: []});
    }

    activate(model) {
        super.activate(model);
        this.value && this.value.GetContent && this.value.GetContent({
            select: 'all'
        }).subscribe(c => {
            this.Item = c;
        });
    }

    pickValue(content: SavedContent) {
        this.Item = content;

        this.searchString = '';
        this.isOpened = false;
        this.isFocused = false;
        if (this.rules.length)
            this.controller.validate();

        this.value.SetContent(this.Item);
    }

    focusIn() {
        if (this.searchString.length > 0) {
            this.isOpened = true;
        }
        this.isFocused = true;
        this.searchInput.focus();
    }

    focusOut() {
        this.isOpened = false;
        if (this.rules.length)
            this.controller.validate();

        this.isFocused = false;
    }

    removeItem(){
        this.Item = null as any;
        this.value.SetContent(null as any);
    }

    handleSearchKeyUp($event: KeyboardEvent) {
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
                    this.pickValue(this.availableValues[this.selectionIndex])
                    $event.preventDefault();
                    $event.stopPropagation();
                }
            }

        }
    }
}