import { FieldSettings, Content, Resources, Retrier } from 'sn-client-js';
import { bindable, computedFrom, customElement } from 'aurelia-framework';

import { AureliaClientFieldConfig } from '../AureliaClientFieldConfig';
import { FieldBaseControl } from './FieldBaseControl';
import { ValidationRules, FluentRules } from 'aurelia-validation';

import { Quill as QuillType } from 'quill';

const Quill = require('quill') as QuillType;

@customElement('rich-text')
export class RichText extends FieldBaseControl<string, FieldSettings.LongTextFieldSetting> {

    quillElementRef: HTMLDivElement;
    containerRef: HTMLDivElement;
    quill: QuillType;

    isSelected: boolean = false;
    textValue: string;
    get rules(): any {
        const parentRules = super.rules || [];
        let thisRules = ValidationRules
            .ensure('value')
            .minLength(this.settings.MinLength || 0)
            .maxLength(this.settings.MaxLength || Infinity);

        return [...(parentRules ? parentRules : []), ...(thisRules.rules ? thisRules.rules : [])];
    }

    public onQuillSelectionChange(range, oldRange, source) {
        this.isSelected = range !== null;
        if (!this.isSelected) {
            let selectedNode: Node | null = window.getSelection().baseNode;
            while (selectedNode != null) {
                if (selectedNode === this.containerRef) {
                    this.isSelected = true;
                    return;
                }
                selectedNode = selectedNode.parentNode;
            }
            this.isSelected = false;
        }
    }

    public onQuillTextChange(delta?, oldDelta?, source?) {
        this.value = (this.quill as any).root.innerHTML;
        this.textValue = this.quill.getText().trim();
    }

    public attached() {
        this.quill = new Quill(this.quillElementRef, {
            modules: {
                toolbar:
                [
                    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                    ['blockquote', 'code-block'],

                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                    [{ 'direction': 'rtl' }],                         // text direction

                    [
                        { 'size': ['small', false, 'large', 'huge'] },   // custom dropdown
                        { 'header': [1, 2, 3, 4, 5, 6, false] }
                    ],

                    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                    [{ 'align': [] }],

                    ['clean']                                         // remove formatting button
                ]
            },
            theme: 'snow'
        });

        this.quill
            .on('selection-change', (range, oldRange, source) => this.onQuillSelectionChange(range, oldRange, source))
            .on('text-change', (delta, oldDelta, source) => this.onQuillTextChange(delta, oldDelta, source));
        (this.quill as any).root.innerHTML = this.value;
    }
}
