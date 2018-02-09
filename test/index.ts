// ToDo: Refactor to TestInit module
import { ExtensionHandlers, Options } from "aurelia-loader-nodejs";
import { globalize, initialize } from "aurelia-pal-nodejs";
import "aurelia-polyfills";
import * as Path from "path";
import { MockCanvasRenderingContext2D } from "./mocks";

initialize();
globalize();

ExtensionHandlers[".css"] = (params: any) => {
    return Promise.resolve(" ");
};

(global as any).Node = (window as any).Node;
(global as any).navigator = {};
(global as any).getComputedStyle = window.getComputedStyle;
(global as any).Text = class { };
// tslint:disable-next-line:max-classes-per-file
(global as any).MutationObserver = class { public observe() { /** */ } public takeRecords() { return []; } };

(global as any).HTMLCanvasElement = HTMLElement;

(global as any).window.fetch = async (...args: any[]) => ({ok: true, json: async () => ({})});

document.getSelection = () => {
    return {
        getRangeAt: () => 1,
    } as any;
};

Options.relativeToDir = Path.join(process.cwd(), "temp", "src");

(window as any).HTMLCanvasElement.prototype.getContext = () => new MockCanvasRenderingContext2D();
(window as any).requestAnimationFrame = (callback: (...args: any[]) => void) => callback(1);

import "quill";
import "reflect-metadata";

export * from "../src";

export * from "./mocks";
export * from "./attributes";
export * from "./collectioncontrols";
export * from "./dialogs";
export * from "./fieldcontrols";
export * from "./navigationcontrols";
export * from "./services";
export * from "./viewcontrols";
