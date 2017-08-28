import { FieldBaseControl } from './FieldBaseControl';
import { FieldSettings, ContentListReferenceField, Content, SavedContent } from 'sn-client-js';
import { customElement, bindable } from 'aurelia-framework';
import { MdInput } from 'aurelia-materialize-bridge';

@customElement('contentlist-reference')
export class ContentListReference extends FieldBaseControl<ContentListReferenceField<Content>, FieldSettings.ReferenceFieldSetting> {

    @bindable
    Items: SavedContent<Content>[] = [];

    @bindable
    public availableValues: SavedContent<Content>[] = [];

    searchRef: MdInput;

    @bindable
    public searchString: string = '';

    @bindable
    isOpened: boolean = false;

    @bindable
    isFocused: boolean = false;

    searchInput: HTMLInputElement;

    
    @bindable
    selectionIndex: number = 0;

    searchStringChanged(newValue: string) {
        this.searchString && this.value && this.value.Search(this.searchString, 10, 0, { select: 'all' }).Exec().subscribe(res => {
            this.availableValues = res.Result.filter(a => this.Items.indexOf(a) === -1 && a !== this.content);
            this.isOpened = true;
            this.selectionIndex = 0;
        }, err => {
        }) || (this.availableValues = []);
    }

    removeReference(item: Content) {
        this.Items = this.Items.filter(i => i !== item);
        this.value.SetContent(this.Items);
    }

    activate(model) {
        super.activate(model);
        this.value && this.value.GetContent && this.value.GetContent({
            select: 'all'
        }).subscribe(c => {
            this.Items = c;
        });
    }

    pickValue(content: SavedContent<Content>) {
        this.Items.push(content);
        this.Items = this.Items.map(a => a);

        this.searchString = '';
        this.isOpened = false;
        this.isFocused = false;
        if (this.rules.length)
            this.controller.validate();

        this.value.SetContent(this.Items);
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

    handleSearchKeyUp($event: KeyboardEvent){
        switch ($event.keyCode){
            case 38: {
                this.selectionIndex = Math.max(this.selectionIndex - 1, 0);
                break;
            }
            case 40: {
                this.selectionIndex = Math.min(this.selectionIndex + 1, this.availableValues.length - 1);
                break;
            }
            case 13: {
                if (this.availableValues[this.selectionIndex]){
                    this.pickValue(this.availableValues[this.selectionIndex])
                }
            }

        }
    }
}