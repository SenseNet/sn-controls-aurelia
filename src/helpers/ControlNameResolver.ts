/**
 * @module Helpers
 * 
 * @preferred
 * @description This module contains helper utilities
 * 
 */ /** */

import { PLATFORM } from 'aurelia-framework';

/**
 * Helper class that resolves content names to be able to use in Composition, based on their Control classes
 * Usage:
 * 
 * ``` ts
 * import { ContentTypes } from 'sn-client-js';
 * const resolvedControlName = ControlNameResolver.getNameForControl(ContentTypes.Task);
 * 
 * ```
 */
export class ControlNameResolver {
    private static nameCache: string[] = [];
    public static getNameForControl(control: {new(...args: any[])}){
        let found: string | null = null;
        if (!control || !control.name || !control.name.length){
            return null;
        }
        if (this.nameCache[control.name] !== undefined){
            return this.nameCache[control.name];
        }
        PLATFORM.eachModule((m, v) => {
            if (v[control.name] === control)
                found = m;
            return true;
        });
        this.nameCache[control.name] = found;
        return found;
    }
}