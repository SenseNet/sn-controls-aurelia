// ToDo: Refactor to TestInit module
import 'aurelia-polyfills';
import '@reactivex/rxjs';
import * as Path from 'path';
import { initialize, globalize } from 'aurelia-pal-nodejs';
import { Options, ExtensionHandlers } from 'aurelia-loader-nodejs';
import { MockCanvasRenderingContext2D } from './mocks';

initialize();
globalize();

ExtensionHandlers['.css'] = (params: any) => {
    return Promise.resolve(' ');
}

(global as any).Node = (window as any).Node;
(global as any).navigator = {};
(global as any).getComputedStyle = window.getComputedStyle;
(global as any).Text = class { };
(global as any).MutationObserver = class { observe() { }; takeRecords() { return []; } };

(global as any).HTMLCanvasElement = HTMLElement;

document.getSelection = () => { 
    return {
        getRangeAt: () => {return 1; }
    } as any;
}


Options.relativeToDir = Path.join(process.cwd(), 'dist', 'src');

(window as any).HTMLCanvasElement.prototype.getContext = () => { return new MockCanvasRenderingContext2D() }
(window as any).requestAnimationFrame = (callback: (...args) => void) => { return callback(1); }

import 'reflect-metadata';
import 'quill';

export * from './mocks';

export * from './attributes';
export * from './collectioncontrols';
export * from './fieldcontrols';
export * from './navigationcontrols';
export * from './services';
export * from './viewcontrols';
