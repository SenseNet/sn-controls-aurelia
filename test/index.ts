// ToDo: Refactor to TestInit module
import 'aurelia-polyfills';
import * as Path from 'path';
import { initialize, globalize } from 'aurelia-pal-nodejs';
import { Options, ExtensionHandlers } from 'aurelia-loader-nodejs';

initialize();
globalize();

import * as jquery from 'jquery';

ExtensionHandlers['.css'] = (params: any) => {
    return Promise.resolve(' ');
}

(global as any).Node = (window as any).Node;
(global as any).navigator = {};
(global as any).Materialize = {};
(global as any).getComputedStyle = window.getComputedStyle;
(global as any).Text = class { };
(global as any).MutationObserver = class { observe() { }; takeRecords() { return []; } };
(global as any).Hammer = require('hammerjs');
(global as any).$ = jquery;
(global as any).jQuery = jquery;
(global as any).validate_field = () => {};
(window as any).$ = jquery;
(window as any).jQuery = jquery;


document.getSelection = () => { 
    return {
        getRangeAt: () => {return 1; }
    } as any;
}


Options.relativeToDir = Path.join(process.cwd(), 'dist', 'src');

import 'reflect-metadata';
import 'quill';

export * from './viewcontrols';
export * from './fieldcontrols';
export * from './helpers';
export * from './navigationcontrols';