# sn-controls-aurelia

[![Gitter chat](https://img.shields.io/gitter/room/SenseNet/SN7ClientAPI.svg?style=flat)](https://gitter.im/SenseNet/SN7ClientAPI)
[![License](https://img.shields.io/github/license/SenseNet/sn-controls-aurelia.svg?style=flat)](https://github.com/SenseNet/sn-controls-aurelia/LICENSE.txt)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat)](http://commitizen.github.io/cz-cli/)

This package contains a collection of UI components and controls for [sensenet ECM](https://www.sensenet.com/), written in [Aurelia Framewok](http://aurelia.io/) with [Aurelia Materialize Bridge](https://github.com/aurelia-ui-toolkits/aurelia-materialize-bridge)

[![Sense/Net Services](https://img.shields.io/badge/sensenet-7.0.0--beta3%20tested-green.svg)](https://github.com/SenseNet/sensenet/releases/tag/v7.0.0-beta3)

## Usage and installation

You can install the latest version from NPM

```
npm install --save sn-controls-aurelia
```

You can import into your Aurelia application's entry point

```ts

import 'sn-controls-aurelia';

// ...
export async function configure(aurelia: Aurelia) {
    aurelia.use
    .standardConfiguration()
    .developmentLogging()
    // ... your other features and plugins
    .plugin(PLATFORM.moduleName('sn-controls-aurelia'));

    await aurelia.start();
    await aurelia.setRoot(PLATFORM.moduleName('app'));
}

```