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
yarn add -D @transcend-io/vz-cli

# install the cli as well
yarn add -D @transcend-io/cli

# default the cli to use US backend
export TRANSCEND_API_URL=https://api.us.transcend.io

# load in API key from a secret file
export TRANSCEND_API_KEY=FILL_ME

# vz cli commands available within package
yarn vz-combine-legal-csv \
   --legalCsv=/Users/test/Desktop/legal.csv \
   --dataFlowExportCsv=/Users/test/Desktop/data-flows.csv \
   --output=/Users/test/Desktop/output.csv

# transcend cli commands available within package
yarn tr-pull --auth=$TRANSCEND_API_KEY --resources=consentManager,dataFlows,cookies
yarn tr-push --auth=$TRANSCEND_API_KEY
yarn tr-update-consent-manager --auth=$TRANSCEND_API_KEY
yarn tr-pull-consent-metrics --auth=$TRANSCEND_API_KEY --start=01/01/2023
yarn tr-upload-data-flows-from-csv --auth=$TRANSCEND_API_KEY --file=./approved-flows.csv --trackerStatus=LIVE
yarn tr-generate-api-keys --auth=$TRANSCEND_API_KEY --email=test@transcend.io --password=$TRANSCEND_PASSWORD \
   --scopes="View Email Templates,View Data Map" --apiKeyTitle="CLI Usage Cross Instance Sync" -file=./working/auth.json
yarn tr-build-xdi-sync-endpoint --auth=$TRANSCEND_API_KEY --xdiLocation=https://cdn.your-site.com/xdi.js
```

_The cli-commands default to using the EU Transcend backend. To use these commands with the US backend, you will need to use the flag You can also set the environment variable `TRANSCEND_API_URL=https://api.us.transcend.io`_

## Transcend CLI

The [Transcend CLI](https://github.com/transcend-io/cli#table-of-contents) comes with documentation on each of the standard cli commands. This repository holds cli commands that are custom to this implementation, such as custom CSV file formats.

## Custom Commands

### vz-combine-legal-csv-data-flows

This command allows for combining information in a CSV from a legal team into a CSV of data flow data

#### Authentication

No authentication is required to run this cli command, it comes CSV files that are expected to be on disk.

#### Arguments

| Argument          | Description                                                                                                                                                                                | Type               | Default                 | Required |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | ----------------------- | -------- |
| legalCsv          | Custom Legal CSV file. File format defined by [`LegalTrackerCsvCodec`](https://github.com/transcend-io/vz-cli/blob/757b42301116b551d0a927944e3c4407a802a9de/src/codecs.ts#L6)              | string - file-path | ./legalMaster.csv       | false    |
| dataFlowExportCsv | Export of data flows from the Transcend dashboard. File format defined by [`DataFlowCsvInput`](https://github.com/transcend-io/cli/blob/main/src/codecs.ts#L821C14-L847)                   | string - file-path | ./triage-data-flows.csv | false    |
| output            | Output file format that can be re-imported into Transcend dashboard. File format defined by [`DataFlowCsvInput`](https://github.com/transcend-io/cli/blob/main/src/codecs.ts#L821C14-L847) | string - file-path | ./combined.csv          | false    |

Note: You `trackerStatus` can be specified on a per data flow basis by adding a column named "Status" to the CSV. The values should be of type `ConsentTrackerStatus` - which is `LIVE` or `NEEDS_REVIEW`.

#### Usage

Combine two files on disk

```sh
yarn vz-combine-legal-csv-data-flows \
   --legalCsv=/Users/test/Desktop/legal.csv \
   --dataFlowExportCsv=/Users/test/Desktop/data-flows.csv \
   --output=/Users/test/Desktop/output.csv
```

### vz-combine-legal-csv-cookies

FIXME

FIXME add tr-upload-cookies-csv

### vz-transform-from-parent-for-children

FIXME

```ts
import { readTranscendYaml, writeTranscendYaml } from '@transcend-io/cli';

const { TRANSCEND_YAML = './transcend.yml' } = process.env;

// Read in contents
const transcend = readTranscendYaml(TRANSCEND_YAML);

// Remove anything that should not be synced
if (transcend['consent-manager']) {
  delete transcend['consent-manager'].domains;
}

// business entity attributes do not need to sync
if (transcend.attributes) {
  transcend.attributes = transcend.attributes
    .map((attr) => ({
      ...attr,
      resources: attr.resources?.filter(
        (resource) => resource !== 'businessEntity',
      ),
    }))
    .filter((attr) => attr.resources && attr.resources.length > 0);
}

// write to disk
writeTranscendYaml(TRANSCEND_YAML, transcend);
```

### vz-consent-manager-configuration-to-summary

FIXME

### vz-consent-manager-configuration-to-summary

FIXME

### vz-derive-integrations-from-data-flows

FIXME

### vz-derive-per-instance-integrations-from-data-flows

FIXME

## Useful Commands

### Combine Legal CSV with Transcend Data Flows

Combine legal's categorizations of vendors, combine those categorizations with what was in Transcend, and push those categorizations back into Transcend.

Step 1) Download the CSV of data flows that you want to edit from the Admin Dashboard under [Consent Manager -> Data Flows](https://app.transcend.io/consent-manager/data-flows). You can download data flows from both the "Triage" and "Approved" tabs.

<img width="1464" alt="Screenshot 2023-06-22 at 6 05 36 PM" src="https://github.com/transcend-io/cli/assets/10264973/c4b65b31-2cf3-49c9-b543-041567c7aff8">

Step 2) Run CLI commands:

```sh
export TRANSCEND_API_URL=https://api.us.transcend.io
export LEGAL_FILE=/Users/test/Desktop/legal.csv
export TRANSCEND_DATA_FLOWS_FILE=/Users/test/Desktop/data-flows.csv
export COMBINED_TRANSCEND_DATA_FLOWS_FILE=/Users/test/Desktop/data-flows.csv
export TRANSCEND_API_KEY=SECRET_FILL_ME
yarn vz-combine-legal-csv --legalCsv=$LEGAL_FILE --dataFlowExportCsv=$TRANSCEND_DATA_FLOWS_FILE --output=$COMBINED_TRANSCEND_DATA_FLOWS_FILE
yarn tr-upload-data-flows-from-csv --auth=$TRANSCEND_API_KEY --file=$COMBINED_TRANSCEND_DATA_FLOWS_FILE --trackerStatus=LIVE
```

#### Required Environment Variables

| Argument                             | Description                                                                                                                                                                                | Type               | Is Secret |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | --------- |
| `LEGAL_FILE`                         | Custom Legal CSV file. File format defined by [`LegalTrackerCsvCodec`](https://github.com/transcend-io/vz-cli/blob/757b42301116b551d0a927944e3c4407a802a9de/src/codecs.ts#L6)              | string - file-path | false     |
| `TRANSCEND_DATA_FLOWS_FILE`          | Export of data flows from the Transcend dashboard. File format defined by [`DataFlowCsvInput`](https://github.com/transcend-io/cli/blob/main/src/codecs.ts#L821C14-L847)                   | string - file-path | false     |
| `COMBINED_TRANSCEND_DATA_FLOWS_FILE` | Output file format that can be re-imported into Transcend dashboard. File format defined by [`DataFlowCsvInput`](https://github.com/transcend-io/cli/blob/main/src/codecs.ts#L821C14-L847) | string - file-path | false     |
| `TRANSCEND_API_URL`                  | Transcend backend URL                                                                                                                                                                      | string - url       | false     |
| `TRANSCEND_API_KEY`                  | Transcend API key with scopes `Manage Cookies`                                                                                                                                             | string - api-key   | true      |

### Combine Legal CSV with Transcend Cookies

Combine legal's categorizations of vendors, combine those categorizations with what was in Transcend, and push those categorizations back into Transcend.

Step 1) Download the CSV of data flows that you want to edit from the Admin Dashboard under [Consent Manager -> Cookies](https://app.transcend.io/consent-manager/cookies). You can download cookies from both the "Triage" and "Approved" tabs.
Step 2) Run CLI commands:

```sh
export TRANSCEND_API_URL=https://api.us.transcend.io
export LEGAL_FILE=/Users/test/Desktop/legal.csv
export TRANSCEND_COOKIES_FILE=/Users/test/Desktop/cookies.csv
export COMBINED_TRANSCEND_COOKIES_FILE=/Users/test/Desktop/cookies.csv
export TRANSCEND_API_KEY=SECRET_FILL_ME
yarn vz-combine-legal-csv-data-flows --legalCsv=$LEGAL_FILE --dataFlowExportCsv=$TRANSCEND_COOKIES_FILE --output=$COMBINED_TRANSCEND_DATA_FLOWS_FILE
yarn tr-upload-cookies-from-csv --auth=$TRANSCEND_API_KEY --file=$COMBINED_TRANSCEND_COOKIES_FILE --trackerStatus=LIVE
```

#### Required Environment Variables

| Argument                          | Description                                                                                                                                                                   | Type               | Is Secret |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | --------- |
| `LEGAL_FILE`                      | Custom Legal CSV file. File format defined by [`LegalTrackerCsvCodec`](https://github.com/transcend-io/vz-cli/blob/757b42301116b551d0a927944e3c4407a802a9de/src/codecs.ts#L6) | string - file-path | false     |
| `TRANSCEND_COOKIES_FILE`          | Export of cookies from the Transcend dashboard. File format defined by [`CookieCsvInput`](FIXME)                                                                              | string - file-path | false     |
| `COMBINED_TRANSCEND_COOKIES_FILE` | Output file format that can be re-imported into Transcend dashboard. File format defined by [`CookieCsvInput`](FIXME)                                                         | string - file-path | false     |
| `TRANSCEND_API_URL`               | Transcend backend URL                                                                                                                                                         | string - url       | false     |
| `TRANSCEND_API_KEY`               | Transcend API key with scopes `Manage Cookies`                                                                                                                                | string - api-key   | true      |

### Generate API keys to Synchronize Cross-Account Data

This command will generate a JSON file (at ./working/api-keys.json) containing a list of API Keys for each Transcend instance. The API keys have the minimal set of permissions required to synchronize data across all Transcend instances for your account. Each API key will have the same title. These API keys will be available under Infrastructure -> API Keys.

```sh
export TRANSCEND_API_URL=https://api.us.transcend.io
export TRANSCEND_EMAIL=test@transcend.io
export TRANSCEND_PASSWORD=SECRET_FILL_ME
export TRANSCEND_API_KEYS_PATH=./working/api-keys.json
export TRANSCEND_PARENT_ORGANIZATION_ID=53f5008e-163a-4208-bd0a-aa5ce2208185
yarn tr-generate-api-keys --email=$TRANSCEND_EMAIL --password=$TRANSCEND_PASSWORD --scopes=""Manage Consent Manager Developer Settings,Manage Data Map,Connect Data Silos,Manage Data Subject Request Settings,Manage Global Attributes,Manage Request Identity Verification,View API Keys,View Data Subject Request Settings,View Email Templates,View Identity Verification Settings,Manage Data Inventory,Manage Data Flows" --apiKeyTitle="[cli][$TRANSCEND_EMAIL] Cross Instance Sync" --file=$TRANSCEND_API_KEYS_PATH --parentOrganizationId=$TRANSCEND_PARENT_ORGANIZATION_ID
```

#### Required Environment Variables

| Argument                           | Description                                                                                                                                         | Type               | Is Secret                          |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ---------------------------------- |
| `TRANSCEND_API_URL`                | Transcend backend URL                                                                                                                               | string - url       | false                              |
| `TRANSCEND_API_KEYS_PATH`          | The path to a JSON file where API keys will be written to. This folder should be git-ignored and secured as the contents of this file are a secret. | string - file-path | false - file contents are a secret |
| `TRANSCEND_PARENT_ORGANIZATION_ID` | The ID of the parent organization that has child organizations that need API keys generated for.                                                    | string - uuid      | false                              |
| `TRANSCEND_EMAIL`                  | Your email address that you use to log into Transcend                                                                                               | string - email     | false                              |
| `TRANSCEND_PASSWORD`               | The password you use to log into Transcend                                                                                                          | string - password  | true                               |

### Delete API Keys Cross-Account

If you need to delete the API keys generated by the above command, this command can be run to delete API keys across all instances that have a specific title. If you decide to run any cli commands on a CI, you can use these commands to establish a process to cycle API keys.

```sh
export TRANSCEND_API_URL=https://api.us.transcend.io
export TRANSCEND_EMAIL=test@transcend.io
export TRANSCEND_API_KEYS_PATH=./working/api-keys.json
export TRANSCEND_PARENT_ORGANIZATION_ID=53f5008e-163a-4208-bd0a-aa5ce2208185
export TRANSCEND_PASSWORD=SECRET_FILL_ME
yarn tr-generate-api-keys --email=$TRANSCEND_EMAIL --password=$TRANSCEND_PASSWORD --scopes="View API Keys" --apiKeyTitle="[cli][$TRANSCEND_EMAIL] Cross Instance Sync" --file=$TRANSCEND_API_KEYS_PATH--createNewApiKey=false --parentOrganizationId=$TRANSCEND_PARENT_ORGANIZATION_ID
```

#### Required Environment Variables

| Argument                           | Description                                                                                                                                             | Type               | Is Secret                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------- |
| `TRANSCEND_API_URL`                | Transcend backend URL                                                                                                                                   | string - url       | false                                                    |
| `TRANSCEND_EMAIL`                  | Your email address that you use to log into Transcend                                                                                                   | string - email     | false                                                    |
| `TRANSCEND_API_KEYS_PATH`          | Path to the JSON file holding the API keys for each instance. This file can be created in section "Generate API keys to Synchronize Cross-Account Data" | string - file-path | false - file contents are secret (should be git-ignored) |
| `TRANSCEND_PARENT_ORGANIZATION_ID` | The ID of the parent organization that has child organizations that need API keys generated for.                                                        | string - uuid      | false                                                    |
| `TRANSCEND_PASSWORD`               | The password you use to log into Transcend                                                                                                              | string - password  | true                                                     |

### Pull Shared Configuration from `0 - Data Mapping` Account

There are some consistent settings that we will apply across all Transcend instances. The set of resource settings that can be pulled can be found here. The resources listed in the command below can be pulled and synced into other instances to enforce a consistent configuration across the privacy request in order to:

- attributes - any custom table columns are defined across the data flows, cookies, privacy requests and data inventory tables
- identifiers - the detected identifiers used to querying users for data deletion
- consentManager - developer settings for the consent manager

```sh
export TRANSCEND_API_URL=https://api.us.transcend.io
export TRANSCEND_API_KEY=SECRET_FILL_ME
yarn tr-pull --auth=$TRANSCEND_API_KEY --resources=attributes,identifiers,consentManager
```

#### Required Environment Variables

| Argument            | Description                                       | Type             | Is Secret |
| ------------------- | ------------------------------------------------- | ---------------- | --------- |
| `TRANSCEND_API_URL` | Transcend backend URL                             | string - url     | false     |
| `TRANSCEND_API_KEY` | Transcend API key with scopes `Manage Data Flows` | string - api-key | true      |

### Transform `transcend.yml` to Remove Non-Syncing Fields

There are some resources that should not be synced in full from the 0 - Data Mapping instance into the other instances. This command removes the values that should not be synced.

```sh
export TRANSCEND_YAML=./transcend.yml
yarn vz-transform-from-parent-for-children --file=$TRANSCEND_YAML
```

#### Required Environment Variables

| Argument         | Description                                                                                                                                                     | Type               | Is Secret |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | --------- |
| `TRANSCEND_YAML` | Transcend yml file format, defined by [`Transcend Input`](https://github.com/transcend-io/cli/blob/d40546cdfd76639ad1c950f913ca9b426a97895f/src/codecs.ts#L749) | string - file-path | false     |

### Push a `transcend.yml` to All Accounts

Once you have a configuration file that encodes the settings that should be set consistently across all instances, you can run

```sh
export TRANSCEND_API_URL=https://api.us.transcend.io
export TRANSCEND_API_KEYS_PATH=./working/api-keys.json
export TRANSCEND_YAML=./transcend.yml
yarn tr-push --auth=$TRANSCEND_API_KEYS_PATH --file=$TRANSCEND_YAML
```

#### Required Environment Variables

| Argument                  | Description                                                                                                                                                             | Type               | Is Secret                                                |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------- |
| `TRANSCEND_API_URL`       | Transcend backend URL                                                                                                                                                   | string - url       | false                                                    |
| `TRANSCEND_YAML`          | Transcend yml file to push. Format defined by [`Transcend Input`](https://github.com/transcend-io/cli/blob/d40546cdfd76639ad1c950f913ca9b426a97895f/src/codecs.ts#L749) | string - file-path | false                                                    |
| `TRANSCEND_API_KEYS_PATH` | Path to the JSON file holding the API keys for each instance. This file can be created in section "Generate API keys to Synchronize Cross-Account Data"                 | string - file-path | false - file contents are secret (should be git-ignored) |

### Pull a `transcend.yml` for Each Instance

If you need to pull the configuration files for all associated Transcend instances, you can do so using the following command:

```sh
export TRANSCEND_API_URL=https://api.us.transcend.io
export TRANSCEND_API_KEYS_PATH=./working/api-keys.json
export TRANSCEND_YAML_FOLDER=./working/output/
yarn tr-pull --auth=$TRANSCEND_API_KEYS_PATH --file=$TRANSCEND_YAML_FOLDER --resources=consentManager,dataFlows,cookies
```

#### Required Environment Variables

| Argument                  | Description                                                                                                                                             | Type               | Is Secret                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------- |
| `TRANSCEND_API_URL`       | Transcend backend URL                                                                                                                                   | string - url       | false                                                    |
| `TRANSCEND_YAML_FOLDER`   | A folder where the `transcend.yml` files will be written. Each file will be named `<instance name>,.yml`                                                | string - file-path | false                                                    |
| `TRANSCEND_API_KEYS_PATH` | Path to the JSON file holding the API keys for each instance. This file can be created in section "Generate API keys to Synchronize Cross-Account Data" | string - file-path | false - file contents are secret (should be git-ignored) |

### Combining Configuration Cross-Instances into the `0 - Data Mapping` -> `Data Inventory` -> `Business Entities` table

Take the output of each Transcend instance and combine them into a single YML file to sync into the `0 - Data Mapping` [Business Entities](https://app.transcend.io/data-map/data-inventory/business-entities) table in the Transcend dashboard. This view allows for a summarization of various information across all Transcend instances.

```sh
export TRANSCEND_API_URL=https://api.us.transcend.io
export COMBINED_TRANSCEND_BUSINESS_ENTITIES=/Users/test/Desktop/business-entities-combined.yml
export TRANSCEND_API_KEY=SECRET_FILL_ME
export TRANSCEND_YAML_FOLDER=./working/output/
export TRANSCEND_API_KEYS_PATH=./working/api-keys.json
rm -rf $TRANSCEND_YAML_FOLDER
yarn tr-pull --auth=$TRANSCEND_API_KEYS_PATH --file=$TRANSCEND_YAML_FOLDER --resources=consentManager
yarn vz-consent-manager-configuration-to-summary --transcendYmlFolder=$TRANSCEND_YAML_FOLDER --output=$COMBINED_TRANSCEND_BUSINESS_ENTITIES
yarn tr-push --auth=$TRANSCEND_API_KEY --file=$COMBINED_TRANSCEND_BUSINESS_ENTITIES
```

#### Required Environment Variables

| Argument                             | Description                                                                                                                                                                                | Type               | Is Secret                                                |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | -------------------------------------------------------- |
| `TRANSCEND_YAML_FOLDER`              | A folder where the `transcend.yml` files will be written. Each file will be named `<instance name>,.yml`                                                                                   | string - file-path | false                                                    |
| `COMBINED_TRANSCEND_DATA_FLOWS_FILE` | Output file format that can be re-imported into Transcend dashboard. File format defined by [`DataFlowCsvInput`](https://github.com/transcend-io/cli/blob/main/src/codecs.ts#L821C14-L847) | string - file-path | false                                                    |
| `TRANSCEND_API_KEYS_PATH`            | Path to the JSON file holding the API keys for each instance. This file can be created in section "Generate API keys to Synchronize Cross-Account Data"                                    | string - file-path | false - file contents are secret (should be git-ignored) |
| `TRANSCEND_API_URL`                  | Transcend backend URL                                                                                                                                                                      | string - url       | false                                                    |
| `TRANSCEND_API_KEY`                  | Transcend API key with scopes `Manage Data Flows`                                                                                                                                          | string - api-key   | true                                                     |

### Pull Down Approved Data Flows to YAML Cross-Account

Pull down list of all data flows that are approved

```sh
export TRANSCEND_API_URL=https://api.us.transcend.io
export TRANSCEND_API_KEYS_PATH=./working/api-keys.json
export TRANSCEND_YAML_FOLDER=./working/output/
yarn tr-pull --auth=$TRANSCEND_API_KEYS_PATH --file=$TRANSCEND_YAML_FOLDER --resources=dataFlows,cookies --trackerStatuses=LIVE
```

#### Required Environment Variables

| Argument                  | Description                                                                                                                                             | Type               | Is Secret                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------- |
| `TRANSCEND_API_URL`       | Transcend backend URL                                                                                                                                   | string - url       | false                                                    |
| `TRANSCEND_YAML_FOLDER`   | A folder where the `transcend.yml` files will be written. Each file will be named `<instance name>,.yml`                                                | string - file-path | false                                                    |
| `TRANSCEND_API_KEYS_PATH` | Path to the JSON file holding the API keys for each instance. This file can be created in section "Generate API keys to Synchronize Cross-Account Data" | string - file-path | false - file contents are secret (should be git-ignored) |

### Generate Cross-Instance List of Ad Tech & Site Tech

Create a single export of ad tech and site tech across all Transcend instances.

1. Pull down the data flows and cookies across all instances
2. Determine the set of Data Silos by looking at the services tied to each data flow and cookie
3. Produce a single `transcend.yml` file with the full set of all Data Silos found from each data flow and cookie
4. Load the `transcend.yml` into the `0 - Data Mapping` Transcend instance.

FIXME

### Generate Per-Instance List of Ad Tech Data Silos

1. Pull down the data flows and cookies across all instances
2. Determine the set of Data Silos for that instance by looking at the services tied to each data flow and cookie
3. Produce a new `transcend.yml` file containing the full set of all Data Silos found from in each instance
4. Load each `transcend.yml` into each respective Transcend instance

FIXME

### Update the Consent Manager to Latest Cross-Instance

Use this command to update each consent manager to the latest version, and deploy all active changes. Please be careful using this command, as it will deploy any outstanding changes since the last deploy.

```sh
export TRANSCEND_API_URL=https://api.us.transcend.io
export TRANSCEND_EMAIL=test@transcend.io
export TRANSCEND_PASSWORD=SECRET_FILL_ME
export TRANSCEND_API_KEYS_PATH=./working/api-keys.json
export TRANSCEND_PARENT_ORGANIZATION_ID=53f5008e-163a-4208-bd0a-aa5ce2208185
yarn tr-generate-api-keys  --email=$TRANSCEND_EMAIL --password=$TRANSCEND_PASSWORD --scopes="Manage Consent Manager" --apiKeyTitle="[cli][$TRANSCEND_EMAIL] Cross Instance Consent Deploy" --file=$TRANSCEND_API_KEYS_PATH --parentOrganizationId=$TRANSCEND_PARENT_ORGANIZATION_ID
yarn tr-update-consent-manager  --auth=$TRANSCEND_API_KEYS_PATH --deploy=true
yarn tr-generate-api-keys  --email=$TRANSCEND_EMAIL --password=$TRANSCEND_PASSWORD --scopes="Manage Consent Manager" --apiKeyTitle="[cli][$TRANSCEND_EMAIL] Cross Instance Consent Deploy" --file=$TRANSCEND_API_KEYS_PATH --createNewApiKey=false --parentOrganizationId=$TRANSCEND_PARENT_ORGANIZATION_ID
```

#### Required Environment Variables

| Argument                           | Description                                                                                                                                             | Type               | Is Secret                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------- |
| `TRANSCEND_API_URL`                | Transcend backend URL                                                                                                                                   | string - url       | false                                                    |
| `TRANSCEND_EMAIL`                  | Your email address that you use to log into Transcend                                                                                                   | string - email     | false                                                    |
| `TRANSCEND_PASSWORD`               | The password you use to log into Transcend                                                                                                              | string - password  | true                                                     |
| `TRANSCEND_API_KEYS_PATH`          | Path to the JSON file holding the API keys for each instance. This file can be created in section "Generate API keys to Synchronize Cross-Account Data" | string - file-path | false - file contents are secret (should be git-ignored) |
| `TRANSCEND_PARENT_ORGANIZATION_ID` | The ID of the parent organization that has child organizations that need API keys generated for.                                                        | string - uuid      | false                                                    |
