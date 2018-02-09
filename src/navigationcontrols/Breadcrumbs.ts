/**
 * @module NavigationControls
 *
 */ /** */

import { IContent } from "@sensenet/client-core";
import { bindable, computedFrom, customElement } from "aurelia-framework";

@customElement("breadcrumbs")
export class Breadcrumbs {
    @bindable
    public selection!: IContent;

    @bindable
    public pathChange!: (change: {path: string}) => void;

    @computedFrom("selection")
    public get segments(): Array<{name: string, path: string}> {
        if (!this.selection || !this.selection.Path) {
            return [];
        }
        const returns: Array<{name: string, path: string}> = [];

        this.selection.Path.split("/").filter((s) => s.length > 0).forEach((segment, index, array) => {
            const segmentPath = "/" + array.slice(0, index + 1).join("/");
            returns.push({
                name: segment,
                path: segmentPath,
            });
        });

        return returns;
    }

}
