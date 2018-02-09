/**
 * @module FieldControls
 *
 */ /** */

import { customElement } from "aurelia-framework";

import { ValidationRules } from "aurelia-validation";
import { FieldBaseControl } from "./FieldBaseControl";

import { LongTextFieldSetting } from "@sensenet/default-content-types";
import { Quill as QuillType, RangeStatic } from "quill";

// tslint:disable-next-line:no-var-requires
const quill = require("quill") as QuillType;

/**
 * Field control for formatted long text using Quill Editor.
 * Usage:
 *
 * ``` html
 * <rich-text content.bind="content" settings.bind="myLongTextFieldSetting"></rich-text>
 * ```
 */

@customElement("rich-text")
export class RichText extends FieldBaseControl<string, LongTextFieldSetting> {

    public quillElementRef!: HTMLDivElement;
    public containerRef!: HTMLDivElement;
    public quill!: QuillType;

    public isSelected: boolean = false;
    public textValue!: string;
    get rules(): any {
        const parentRules = super.rules;
        const thisRules = ValidationRules
            .ensure("value")
            .minLength(this.settings.MinLength || 0)
            .maxLength(this.settings.MaxLength || Infinity).rules || [];

        return [...parentRules, ...thisRules];
    }

    public onQuillSelectionChange(range: RangeStatic | null, oldRange: RangeStatic | null, source?: "api" | "user" | "silent" | null) {
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

    public onQuillTextChange() {
        this.value = (this.quill as any).root.innerHTML;
        this.textValue = this.quill.getText().trim();
    }

    public attached() {
        this.quill = new (quill as any)(this.quillElementRef, {
            modules: {
                toolbar:
                [
                    ["bold", "italic", "underline", "strike"],        // toggled buttons
                    ["blockquote", "code-block"],

                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ script: "sub" }, { script: "super" }],      // superscript/subscript
                    [{ indent: "-1" }, { indent: "+1" }],          // outdent/indent
                    [{ direction: "rtl" }],                         // text direction

                    [
                        { size: ["small", false, "large", "huge"] },   // custom dropdown
                        { header: [1, 2, 3, 4, 5, 6, false] },
                    ],

                    [{ color: [] }, { background: [] }],          // dropdown with defaults from theme
                    [{ align: [] }],

                    ["clean"],                                         // remove formatting button
                ],
            },
            theme: "snow",
        });

        this.quill
            .on("selection-change", (range, oldRange, source) => this.onQuillSelectionChange(range, oldRange, source))
            .on("text-change", (delta, oldDelta, source) => this.onQuillTextChange());
        (this.quill as any).root.innerHTML = this.value;
    }
}
