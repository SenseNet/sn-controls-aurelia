# sn-controls-aurelia

------
### This package is not under active development. You can find our latest packages in the [sensenset/sn-client](https://github.com/sensenet/sn-client) monorepo.
------

[![Gitter chat](https://img.shields.io/gitter/room/SenseNet/SN7ClientAPI.svg?style=flat)](https://gitter.im/SenseNet/SN7ClientAPI)
[![Build Status](https://travis-ci.org/SenseNet/sn-controls-aurelia.svg?branch=master)](https://travis-ci.org/SenseNet/sn-controls-aurelia)
[![codecov](https://codecov.io/gh/SenseNet/sn-controls-aurelia/branch/master/graph/badge.svg)](https://codecov.io/gh/SenseNet/sn-controls-aurelia)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/323f6a8be16546aa802808897583295d)](https://www.codacy.com/app/SenseNet/sn-controls-aurelia?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=SenseNet/sn-controls-aurelia&amp;utm_campaign=Badge_Grade)
[![NPM version](https://img.shields.io/npm/v/sn-controls-aurelia.svg?style=flat)](https://www.npmjs.com/package/sn-controls-aurelia)
[![NPM downloads](https://img.shields.io/npm/dt/sn-controls-aurelia.svg?style=flat)](https://www.npmjs.com/package/sn-controls-aurelia)
[![License](https://img.shields.io/github/license/SenseNet/sn-controls-aurelia.svg?style=flat)](https://github.com/SenseNet/sn-controls-aurelia/LICENSE.txt)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat)](http://commitizen.github.io/cz-cli/)
[![Greenkeeper badge](https://badges.greenkeeper.io/SenseNet/sn-controls-aurelia.svg)](https://greenkeeper.io/)



This package contains a collection of UI components and controls for [sensenet](https://www.sensenet.com/), written in [Aurelia Framewok](http://aurelia.io/)

[![Sense/Net Services](https://img.shields.io/badge/sensenet-7.0.0%20tested-green.svg)](https://github.com/SenseNet/sensenet/releases/tag/v7.0.0)

## Usage and installation

You can install the latest version from NPM

```
npm install --save @sensenet/controls-aurelia
```

You can import into your Aurelia application's entry point

```ts
import { Repository } from '@sensenet/client-core';
// ... your other imports

export async function configure(aurelia: Aurelia) {
    aurelia.use
    .standardConfiguration()
    .developmentLogging()
    // ... your other features and plugins
    .plugin(PLATFORM.moduleName('aurelia-validation'))
    .plugin(PLATFORM.moduleName('sn-controls-aurelia'));

    aurelia.container.registerSingleton(Repository, () => {
        const repo = new Repository(
        {
            repositoryUrl: 'https://my-sn7-instance',
        });
        return repo;
    });

    await aurelia.start();
    await aurelia.setRoot(PLATFORM.moduleName('app'));
}

```

If you are using Webpack, add these dependencies into your *webpack.config*'s *plugins* section:

```ts
new ModuleDependenciesPlugin({
    "sn-controls-aurelia": [
    './attributes/ContentDragCustomAttribute',
    './attributes/ContentDropCustomAttribute',
    './attributes/SettingsValidationCustomAttribute'
    ]
}),
```

Please also add these into your HTML template's ```<head>``` section:
```html
<head>
  
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Roboto+Mono" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
  
</head>
```
