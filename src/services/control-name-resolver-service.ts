/**
 * @module Services
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
 export class ControlNameResolverService {
     private nameCache: string[] = [];
     public getNameForControl(control: {new(...args: any[])} | {name: string}, eachModule: (callback: (key: string, value: Object) => boolean) => void = PLATFORM.eachModule){
         let found: string | null = null;
         if (!control || !control.name || !control.name.length){
             return null;
         }
         if (this.nameCache[control.name] !== undefined){
             return this.nameCache[control.name];
         }
         eachModule((m, v) => {
             if (v[control.name] === control)
                 found = m;
             return true;
         });

         if (!found){
            eachModule((m, v) => {
                if (v[control.name] && v[control.name].name === control.name)
                    found = m;
                return true;
            }); 
         }

         this.nameCache[control.name] = found;
         return found;
     }
 }