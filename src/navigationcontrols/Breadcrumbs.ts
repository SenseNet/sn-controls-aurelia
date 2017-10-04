import { bindable, customElement, computedFrom } from 'aurelia-framework';
import { Content } from 'sn-client-js';


@customElement('breadcrumbs')
export class Breadcrumbs {
    @bindable
    public Selection: Content;

    @bindable
    PathChange: ({path: string}) => void;




    @computedFrom('Selection')
    public get Segments(): {name: string, path: string}[]{
        if (!this.Selection || !this.Selection.Path){
            return [];
        }
        const returns: {name: string, path: string}[] = [];

        this.Selection.Path.split('/').filter(s => s.length > 0).forEach((segment, index, array) => {
            const segmentPath = '/' + array.slice(0, index + 1).join('/');
            returns.push({
                name: segment,
                path: segmentPath
            });
        });

        return returns;
    }

}