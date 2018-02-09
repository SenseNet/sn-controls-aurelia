/**
 * @module Services
 *
 */ /** */

 import { PLATFORM } from "aurelia-framework";

 /**
  * Helper class that resolves content names to be able to use in Composition, based on their Control classes
  * Usage:
  *
  * ``` ts
  * const resolvedControlName = ControlNameResolver.getNameForControl(Task);
  *
  * ```
  */
 export class ControlNameResolverService {
     private nameCache: Map<string, string | null> = new Map();
     public getNameForControl(control: {new(...args: any[]): any} | {name: string}, eachModule: (callback: (key: string, value: object) => boolean) => void = PLATFORM.eachModule): string | null {
         let found: string | null = null;
         if (!control || !control.name || !control.name.length) {
             return null;
         }
         if (this.nameCache.has(control.name)) {
             return this.nameCache.get(control.name) || null;
         }
         eachModule((m, v: any) => {
             if (v[control.name] === control) {
                 found = m;
             }
             return true;
         });

         if (!found) {
            eachModule((m, v: any) => {
                if (v[control.name] && v[control.name].name === control.name) {
                    found = m;
                }
                return true;
            });
         }

         this.nameCache.set(control.name, found);
         return found;
     }
 }
