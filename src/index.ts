/**
 * @module sn-controls-aurelia
 *
 * @description General classes, modules and methods for sn-controls-aurelia package
 *
 */ /** */

import { FrameworkConfiguration, PLATFORM } from "aurelia-framework";

export * from "./fieldcontrols";
export * from "./navigationcontrols";
export * from "./attributes";
export * from "./collectioncontrols";
export * from "./dialogs";
export * from "./services";
export * from "./viewcontrols";
export * from "./Enums";

/**
 * A list of modules that will be imported when using sn-controls-aurelia as an Aurelia plugin
 */
export const modules = [
        "./attributes/ContentDragCustomAttribute",
        "./attributes/ContentDropCustomAttribute",
        "./attributes/SettingsValidationCustomAttribute",

        "./viewcontrols/ContentView",
        "./viewcontrols/GenericView",
        "./navigationcontrols/Tree",
        "./navigationcontrols/Breadcrumbs",
        "./collectioncontrols/ContentList",
        "./dialogs/AddContent",
        "./dialogs/DeleteContent",
        "./dialogs/EditContent",
        "./dialogs/SetPermissions",

        "./fieldcontrols/Checkbox",
        "./fieldcontrols/Choice",
        "./fieldcontrols/ContentReference",
        "./fieldcontrols/ContentListReference",
        "./fieldcontrols/DumpField",
        "./fieldcontrols/Icon",
        "./fieldcontrols/DateOnly",
        "./fieldcontrols/DateTime",
        "./fieldcontrols/DisplayName",
        "./fieldcontrols/NameField",
        "./fieldcontrols/Integer",
        "./fieldcontrols/LongText",
        "./fieldcontrols/Number",
        "./fieldcontrols/Password",
        "./fieldcontrols/Percentage",
        "./fieldcontrols/RichText",
        "./fieldcontrols/ShortText",
];

/**
 * The main entry point for configuring the package as an Aurelia plugin
 * @param app the Aurelia FrameworkConfiguration object
 */
export function configure(app: FrameworkConfiguration) {
    app.globalResources(modules.map((m) => PLATFORM.moduleName(m)));
    app.plugin("aurelia-validation");
}
