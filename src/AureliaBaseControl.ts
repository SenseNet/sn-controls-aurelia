/**
 * @module sn-controls-aurelia
 * 
 * 
 */ /** */
import { ControlNameResolver } from './helpers/ControlNameResolver';

/**
 * @description Base class for sensenet Aurelia controls
 */
export class AureliaBaseControl {

    /**
     * @returns the resolved name for the specified control
     * @param control the type of the Control, e.g. FieldControls.ShortText
     */
    public resolveControlName(control: { new (...args: any[]) }) {
        return ControlNameResolver.getNameForControl(control);
    }

}
