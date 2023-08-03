<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [transcend.yml](#transcendyml)
- [Usage](#usage)
  - [tr-pull](#tr-pull)
    - [Authentication](#authentication)
    - [Arguments](#arguments)
    - [Usage](#usage-1)
  - [tr-push](#tr-push)
    - [Authentication](#authentication-1)
    - [Arguments](#arguments-1)
    - [Usage](#usage-2)
    - [CI Integration](#ci-integration)
    - [Dynamic Variables](#dynamic-variables)
  - [tr-discover-silos](#tr-discover-silos)
    - [Authentication](#authentication-2)
    - [Usage](#usage-3)
    - [Arguments](#arguments-2)
  - [tr-request-approve](#tr-request-approve)
    - [Authentication](#authentication-3)
    - [Arguments](#arguments-3)
    - [Usage](#usage-4)
  - [tr-request-cancel](#tr-request-cancel)
    - [Authentication](#authentication-4)
    - [Arguments](#arguments-4)
    - [Usage](#usage-5)
  - [tr-request-upload](#tr-request-upload)
    - [Authentication](#authentication-5)
    - [Arguments](#arguments-5)
    - [Usage](#usage-6)
  - [tr-request-restart](#tr-request-restart)
    - [Authentication](#authentication-6)
    - [Arguments](#arguments-6)
    - [Usage](#usage-7)
  - [tr-request-export](#tr-request-export)
    - [Authentication](#authentication-7)
    - [Arguments](#arguments-7)
    - [Usage](#usage-8)
  - [tr-cron-pull-identifiers](#tr-cron-pull-identifiers)
    - [Authentication](#authentication-8)
    - [Arguments](#arguments-8)
    - [Usage](#usage-9)
  - [tr-cron-mark-identifiers-completed](#tr-cron-mark-identifiers-completed)
    - [Authentication](#authentication-9)
    - [Arguments](#arguments-9)
    - [Usage](#usage-10)
  - [tr-manual-enrichment-pull-identifiers](#tr-manual-enrichment-pull-identifiers)
    - [Authentication](#authentication-10)
    - [Arguments](#arguments-10)
    - [Usage](#usage-11)
  - [tr-manual-enrichment-push-identifiers](#tr-manual-enrichment-push-identifiers)
    - [Authentication](#authentication-11)
    - [Arguments](#arguments-11)
    - [Usage](#usage-12)
  - [tr-mark-request-data-silos-completed](#tr-mark-request-data-silos-completed)
    - [Authentication](#authentication-12)
    - [Arguments](#arguments-12)
    - [Usage](#usage-13)
  - [tr-skip-request-data-silos](#tr-skip-request-data-silos)
    - [Authentication](#authentication-13)
    - [Arguments](#arguments-13)
    - [Usage](#usage-14)
  - [tr-retry-request-data-silos](#tr-retry-request-data-silos)
    - [Authentication](#authentication-14)
    - [Arguments](#arguments-14)
    - [Usage](#usage-15)
  - [tr-update-consent-manager](#tr-update-consent-manager)
    - [Authentication](#authentication-15)
    - [Arguments](#arguments-15)
    - [Usage](#usage-16)
  - [tr-pull-consent-metrics](#tr-pull-consent-metrics)
    - [Authentication](#authentication-16)
    - [Arguments](#arguments-16)
    - [Usage](#usage-17)
  - [tr-upload-data-flows-from-csv](#tr-upload-data-flows-from-csv)
    - [Authentication](#authentication-17)
    - [Arguments](#arguments-17)
    - [Usage](#usage-18)
  - [tr-generate-api-keys](#tr-generate-api-keys)
    - [Authentication](#authentication-18)
    - [Arguments](#arguments-18)
    - [Usage](#usage-19)
  - [tr-build-xdi-sync-endpoint](#tr-build-xdi-sync-endpoint)
    - [Authentication](#authentication-19)
    - [Arguments](#arguments-19)
    - [Usage](#usage-20)
- [Proxy usage](#proxy-usage)

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
