<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

A command line interface that allows you to define your Data Map in code and sync that configuration back to https://app.transcend.io.

## Installation

This package is distributed through npm and github package registries and assumes an installation of [npm and node](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

If your codebase is typescript or javascript based, you can add this package as a dev dependency:

```sh
# install locally with yarn
yarn add -D @transcend-io/cli

# cli commands available within package
yarn tr-pull --auth=$TRANSCEND_API_KEY
yarn tr-push --auth=$TRANSCEND_API_KEY
yarn tr-discover-silos --auth=$TRANSCEND_API_KEY
yarn tr-request-approve --auth=$TRANSCEND_API_KEY
yarn tr-request-cancel --auth=$TRANSCEND_API_KEY
yarn tr-request-upload --auth=$TRANSCEND_API_KEY
yarn tr-request-export --auth=$TRANSCEND_API_KEY
yarn tr-request-restart --auth=$TRANSCEND_API_KEY
yarn tr-cron-pull-identifiers --auth=$TRANSCEND_API_KEY
yarn tr-cron-mark-identifiers-completed --auth=$TRANSCEND_API_KEY
yarn tr-manual-enrichment-pull-identifiers --auth=$TRANSCEND_API_KEY
yarn tr-mark-request-data-silos-completed --auth=$TRANSCEND_API_KEY
yarn tr-skip-request-data-silos --auth=$TRANSCEND_API_KEY
yarn tr-retry-request-data-silos --auth=$TRANSCEND_API_KEY
yarn tr-update-consent-manager --auth=$TRANSCEND_API_KEY
yarn tr-pull-consent-metrics --auth=$TRANSCEND_API_KEY
yarn tr-upload-data-flows-from-csv --auth=$TRANSCEND_API_KEY
yarn tr-generate-api-keys --auth=$TRANSCEND_API_KEY
yarn tr-build-xdi-sync-endpoint --auth=$TRANSCEND_API_KEY
```

or

```sh
# install locally with npm
npm i -D @transcend-io/cli

# cli commands available within package
tr-pull --auth=$TRANSCEND_API_KEY
tr-push --auth=$TRANSCEND_API_KEY
tr-discover-silos --auth=$TRANSCEND_API_KEY
tr-request-approve --auth=$TRANSCEND_API_KEY
tr-request-cancel --auth=$TRANSCEND_API_KEY
tr-request-upload --auth=$TRANSCEND_API_KEY
tr-request-export --auth=$TRANSCEND_API_KEY
tr-request-restart --auth=$TRANSCEND_API_KEY
tr-cron-pull-identifiers --auth=$TRANSCEND_API_KEY
tr-cron-mark-identifiers-completed --auth=$TRANSCEND_API_KEY
tr-manual-enrichment-pull-identifiers --auth=$TRANSCEND_API_KEY
tr-mark-request-data-silos-completed --auth=$TRANSCEND_API_KEY
tr-skip-request-data-silos --auth=$TRANSCEND_API_KEY
tr-retry-request-data-silos --auth=$TRANSCEND_API_KEY
tr-update-consent-manager --auth=$TRANSCEND_API_KEY
tr-pull-consent-metrics --auth=$TRANSCEND_API_KEY
tr-upload-data-flows-from-csv --auth=$TRANSCEND_API_KEY
tr-generate-api-keys --auth=$TRANSCEND_API_KEY
tr-build-xdi-sync-endpoint --auth=$TRANSCEND_API_KEY

```

alternatively, you can install the cli globally on your machine:

```sh
# install locally with npm
npm i -g @transcend-io/cli

# cli commands available everywhere on machine
tr-pull --auth=$TRANSCEND_API_KEY
...
```

FIXME

_The cli-commands default to using the EU Transcend backend. To use these commands with the US backend, you will need to use the flag --transcendUrl=https://api.us.transcend.io._
