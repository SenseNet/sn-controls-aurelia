import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import 'materialize-css';

export const modules = [
        './viewcontrols/ContentView',
        './viewcontrols/GenericView',
        './navigationcontrols/Tree',
        
        './fieldcontrols/Choice',
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

export function configure(app: FrameworkConfiguration){
    app.globalResources(modules);
    app.plugin(PLATFORM.moduleName('aurelia-materialize-bridge'), b => b.useAll()); 
    app.plugin('aurelia-validation');
}

export * from './fieldcontrols';
export * from './navigationcontrols';

export * from './services';

export * from './viewcontrols/ContentView';
export * from './viewcontrols/GenericView';