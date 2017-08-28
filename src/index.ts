/**
 * @module sn-controls-aurelia
 * 
 * @description General classes, modules and methods for sn-controls-aurelia package
 * 
 */ /** */

import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import 'materialize-css';

/**
 * A list of modules that will be imported when using sn-controls-aurelia as an Aurelia plugin
 */
export const modules = [
        './containers/ContentDrag',
        './containers/ContentDrop',

        './viewcontrols/ContentView',
        './viewcontrols/GenericView',
        './navigationcontrols/Tree',
        './navigationcontrols/Breadcrumbs',
        './collectioncontrols/ContentList',
        
        './fieldcontrols/Checkbox',
        './fieldcontrols/Choice',
        './fieldcontrols/ContentReference',
        './fieldcontrols/ContentListReference',
        './fieldcontrols/DumpField',
        './fieldcontrols/Icon',
        './fieldcontrols/DateOnly',
        './fieldcontrols/DateTime',
        './fieldcontrols/DisplayName',
        './fieldcontrols/NameField',
        './fieldcontrols/Integer',
        './fieldcontrols/LongText',
        './fieldcontrols/Number',       
        './fieldcontrols/Password',
        './fieldcontrols/Percentage',
        './fieldcontrols/RichText',
        './fieldcontrols/ShortText',
]

/**
 * The main entry point for configuring the package as an Aurelia plugin
 * @param app the Aurelia FrameworkConfiguration object
 */
export function configure(app: FrameworkConfiguration){
    app.globalResources(modules);
    app.plugin(PLATFORM.moduleName('aurelia-materialize-bridge'), b => b.useAll().preventWavesAttach()); 
    app.plugin('aurelia-validation');
}

export * from './fieldcontrols';
export * from './navigationcontrols';
export * from './containers'
export * from './collectioncontrols';
export * from './services';
export * from './viewcontrols/ContentView';
export * from './viewcontrols/GenericView';

export * from './Enums';