import { ComponentAttached, ComponentCreated, ComponentBind, ComponentDetached, ComponentUnbind } from 'aurelia-framework';
import { ControlNameResolver } from './helpers/ControlNameResolver';
import { View } from 'aurelia-templating';

export class AureliaBaseControl {

    constructor() {
       
    }
    
    public resolveControlName(control: { new (...args: any[]) }) {
        return ControlNameResolver.getNameForControl(control);
    }

}
