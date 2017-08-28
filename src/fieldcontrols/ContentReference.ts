import { FieldBaseControl } from './FieldBaseControl';
import { FieldSettings, ContentReferenceField, Content, SavedContent } from 'sn-client-js';
import { customElement, bindable } from 'aurelia-framework';
import { MdInput } from 'aurelia-materialize-bridge';
import { ValidationRules } from 'aurelia-validation';

@customElement('content-reference')
export class ContentReference extends FieldBaseControl<ContentReferenceField<Content>, FieldSettings.ReferenceFieldSetting> {
    @bindable
    public availableValues: SavedContent<Content>[] = [];

    searchRef: MdInput

    @bindable
    public searchString: string = '';

    @bindable
    selectedContent: Content | null;

    @bindable
    isOpened: boolean = false;
    get rules(): any {
        const parentRules = super.rules;
        let thisRules = ValidationRules
            .ensure('searchString')
            .satisfies((v: string, obj: this) => {
                if (!obj.settings.Compulsory && !v) {
                    return true;
                }

                if (obj.selectedContent && (v === obj.selectedContent.DisplayName || v === obj.selectedContent.Name)) {
                    return true;
                }
                return false;
            }).withMessage('Invalid value.')
            .rules

        return [...parentRules, ...thisRules];
    }

    searchStringChanged(newValue: string) {
        if (this.selectedContent && newValue !== this.selectedContent.DisplayName && newValue !== this.selectedContent.Name || !this.selectedContent) {
            this.selectedContent = null;
            this.value && this.value.Search(this.searchString, 10, 0, { select: 'all' }).Exec().subscribe(res => {
                this.availableValues = res.Result;
                this.isOpened = true;
            }, err => {
            })
        }
    }

    activate(model) {
        super.activate(model);
        this.value && this.value.GetContent && this.value.GetContent().subscribe(c => {
            if (c !== null) {
                this.selectedContent = c;
                this.searchString = c.DisplayName || c.Name || '';
                this.isOpened = false;
            }
        })
    }

    pickValue(content: SavedContent<Content>) {
        this.value.SetContent(content);
        this.selectedContent = content;
        this.searchString = content.DisplayName || content.Name || '';
        this.isOpened = false;
        if (this.rules.length)
            this.controller.validate();
    }

    focusIn() {
        if (this.searchString.length > 0 && !this.selectedContent) {
            this.isOpened = true;
        }
    }

    focusOut() {
        this.isOpened = false;
        if (this.rules.length)
            this.controller.validate();
    }
}