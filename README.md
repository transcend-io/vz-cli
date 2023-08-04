<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
  - [Step 1) Install NPM, Node, and Yarn](#step-1-install-npm-node-and-yarn)
  - [Step 2) Install @transcend-io/vz-cli and @transcend-io/cli](#step-2-install-transcend-iovz-cli-and-transcend-iocli)
  - [Step 3) Create a .env file to store secrets and common environment configuration](#step-3-create-a-env-file-to-store-secrets-and-common-environment-configuration)
  - [Step 4) Run commands](#step-4-run-commands)
- [Transcend CLI](#transcend-cli)
- [Custom Commands](#custom-commands)
  - [vz-combine-legal-csv-data-flows](#vz-combine-legal-csv-data-flows)
    - [Authentication](#authentication)
    - [Arguments](#arguments)
    - [Usage](#usage)
  - [vz-combine-legal-csv-cookies](#vz-combine-legal-csv-cookies)
    - [Authentication](#authentication-1)
    - [Arguments](#arguments-1)
    - [Usage](#usage-1)
  - [vz-transform-from-parent-for-children](#vz-transform-from-parent-for-children)
    - [Authentication](#authentication-2)
    - [Arguments](#arguments-2)
    - [Usage](#usage-2)
- [Useful Commands](#useful-commands)
  - [A) Combine Legal CSV with Transcend Data Flows and Cookies](#a-combine-legal-csv-with-transcend-data-flows-and-cookies)
    - [Required Environment Variables](#required-environment-variables)
  - [B) Generate API keys to Synchronize Cross-Account Data](#b-generate-api-keys-to-synchronize-cross-account-data)
    - [Required Environment Variables](#required-environment-variables-1)
  - [C) Delete API Keys Cross-Account](#c-delete-api-keys-cross-account)
    - [Required Environment Variables](#required-environment-variables-2)
  - [D) Sync Shared Configuration from `0 - Data Mapping` Across All Accounts](#d-sync-shared-configuration-from-0---data-mapping-across-all-accounts)
    - [Required Environment Variables](#required-environment-variables-3)
  - [E) Pull a `transcend.yml` for Each Instance](#e-pull-a-transcendyml-for-each-instance)
    - [Required Environment Variables](#required-environment-variables-4)
  - [F) Combining Configurations Cross-Instances into the `0 - Data Mapping` -> `Data Inventory` -> `Business Entities` table](#f-combining-configurations-cross-instances-into-the-0---data-mapping---data-inventory---business-entities-table)
    - [Required Environment Variables](#required-environment-variables-5)
  - [G) Pull Down Approved Data Flows to YAML Cross-Account](#g-pull-down-approved-data-flows-to-yaml-cross-account)
    - [Required Environment Variables](#required-environment-variables-6)
  - [H) Generate Cross-Instance List of Ad Tech & Site Tech](#h-generate-cross-instance-list-of-ad-tech--site-tech)
    - [Required Environment Variables](#required-environment-variables-7)
  - [I) Generate Per-Instance List of Ad Tech Data Silos](#i-generate-per-instance-list-of-ad-tech-data-silos)
    - [Required Environment Variables](#required-environment-variables-8)
  - [J) Update the Consent Manager to Latest Cross-Instance](#j-update-the-consent-manager-to-latest-cross-instance)
    - [Required Environment Variables](#required-environment-variables-9)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Overview

A command line interface that allows you to define your Data Map in code and sync that configuration back to https://app.transcend.io.

## Installation

### Step 1) Install NPM, Node, and Yarn

This package is distributed through npm and github package registries and assumes an installation of [npm and node](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). You will also want to install [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable).

### Step 2) Install @transcend-io/vz-cli and @transcend-io/cli

If your codebase is typescript or javascript based, you can add this package as a dev dependency:

```sh
# install the vz cli
yarn add -D @transcend-io/vz-cli

# install the transcend cli as well
yarn add -D @transcend-io/cli
```

### Step 3) Create a .env file to store secrets and common environment configuration

Create a `./.env` file with variables like this:

```.sh
TRANSCEND_API_KEY=FILL_ME
TRANSCEND_API_URL=https://api.us.transcend.io
```

The `TRANSCEND_API_KEY` is a secret, and this should not be committed to git or pasted into your terminal history. You should add your `./.env` to the `.gitignore` if you are running these commands from a git repository. If you do commit an API key or paste it in the terminal, the API key can be cycled [in the Transcend Dashboard](https://app.transcend.io/infrastructure/api-keys).

### Step 4) Run commands

```sh
# load in .env file
source .env

# vz cli commands available within @transcend-io/vz-cli
yarn vz-combine-legal-csv-data-flows \
   --legalCsv=/Users/test/Desktop/legal.csv \
   --dataFlowExportCsv=/Users/test/Desktop/data-flows.csv \
   --output=/Users/test/Desktop/output.csv
yarn vz-combine-legal-csv-cookies \
   --legalCsv=/Users/test/Desktop/legal.csv \
   --dataFlowExportCsv=/Users/test/Desktop/cookies.csv \
   --output=/Users/test/Desktop/output.csv
yarn vz-transcend-from-parent-for-children --file=./transcend.yml

# transcend cli commands available within @transcend-io/cli
yarn tr-pull --auth=$TRANSCEND_API_KEY --resources=consentManager,dataFlows,cookies
yarn tr-push --auth=$TRANSCEND_API_KEY
yarn tr-update-consent-manager --auth=$TRANSCEND_API_KEY
yarn tr-pull-consent-metrics --auth=$TRANSCEND_API_KEY --start=01/01/2023
yarn tr-consent-managers-to-business-entities --consentManagerYmlFolder=./working/consent-managers/ --output=./custom.yml
yarn tr-upload-data-flows-from-csv --auth=$TRANSCEND_API_KEY --file=./approved-flows.csv --trackerStatus=LIVE
yarn tr-upload-cookies-from-csv --auth=$TRANSCEND_API_KEY --file=./approved-flows.csv --trackerStatus=LIVE
yarn tr-generate-api-keys --auth=$TRANSCEND_API_KEY --email=test@transcend.io --password=$TRANSCEND_PASSWORD \
   --scopes="View Email Templates,View Data Map" --apiKeyTitle="CLI Usage Cross Instance Sync" -file=./working/auth.json
yarn tr-build-xdi-sync-endpoint --auth=$TRANSCEND_API_KEY --xdiLocation=https://cdn.your-site.com/xdi.js
yarn tr-derive-data-silos-from-data-flows --auth=$TRANSCEND_API_KEY --dataFlowsYmlFolder=./working/data-flows/ \
   --dataSilosYmlFolder=./working/data-silos/ --ignoreYmls="0 - Data Mapping.yml"
yarn tr-derive-data-silos-from-data-flows-cross-instance --auth=$TRANSCEND_API_KEY
   --dataFlowsYmlFolder=./working/data-flows/ --output=./transcend.yml
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

This command allows for combining information in a CSV from a legal team into a CSV of cookies

#### Authentication

No authentication is required to run this cli command, it comes CSV files that are expected to be on disk.

#### Arguments

| Argument        | Description                                                                                                                                                                           | Type               | Default              | Required |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------------------- | -------- |
| legalCsv        | Custom Legal CSV file. File format defined by [`LegalTrackerCsvCodec`](https://github.com/transcend-io/vz-cli/blob/757b42301116b551d0a927944e3c4407a802a9de/src/codecs.ts#L6)         | string - file-path | ./legalMaster.csv    | false    |
| cookieExportCsv | Export of cookies from the Transcend dashboard. File format defined by [`CookieCsvInput`](https://github.com/transcend-io/cli/blob/main/src/codecs.ts#L849-L873)                      | string - file-path | ./triage-cookies.csv | false    |
| output          | Output file format that can be re-imported into Transcend dashboard. File format defined by [`CookieCsvInput`](https://github.com/transcend-io/cli/blob/main/src/codecs.ts#L849-L873) | string - file-path | ./combined.csv       | false    |

Note: You `trackerStatus` can be specified on a per data flow basis by adding a column named "Status" to the CSV. The values should be of type `ConsentTrackerStatus` - which is `LIVE` or `NEEDS_REVIEW`.

#### Usage

Combine two files on disk

```sh
yarn vz-combine-legal-csv-cookies \
   --legalCsv=/Users/test/Desktop/legal.csv \
   --cookieExportCsv=/Users/test/Desktop/cookies.csv \
   --output=/Users/test/Desktop/output.csv
```

### vz-transform-from-parent-for-children

Remove data from the `0 - Data Mapping` `transcend.yml` output that should not be synced to the other child Transcend instances.

#### Authentication

No authentication is required to run this cli command, it operates on a YML file on disk

#### Arguments

| Argument | Description                  | Type               | Default         | Required |
| -------- | ---------------------------- | ------------------ | --------------- | -------- |
| file     | Path to `transcend.yml` file | string - file-path | ./transcend.yml | false    |

#### Usage

```sh
yarn vz-transcend-from-parent-for-children --file=./transcend.yml
```

## Useful Commands

### A) Combine Legal CSV with Transcend Data Flows and Cookies

Combine legal's categorizations of vendors, combine those categorizations with what was in Transcend, and push those categorizations back into Transcend.

Step 1) Download the CSV of data flows that you want to edit from the Admin Dashboard under [Consent Manager -> Data Flows](https://app.transcend.io/consent-manager/data-flows). You can download data flows from both the "Triage" and "Approved" tabs.

<img width="1464" alt="Screenshot 2023-06-22 at 6 05 36 PM" src="https://github.com/transcend-io/cli/assets/10264973/c4b65b31-2cf3-49c9-b543-041567c7aff8">

Step 2) Download the CSV of cookies that you want to edit from the Admin Dashboard under [Consent Manager -> Cookies](https://app.transcend.io/consent-manager/cookies). You can download data flows from both the "Triage" and "Approved" tabs.

Step 3) Run CLI commands:

```sh
export TRANSCEND_API_URL=https://api.us.transcend.io
export LEGAL_FILE=/Users/test/Desktop/legal.csv
export TRANSCEND_DATA_FLOWS_FILE=/Users/test/Desktop/data-flows.csv
export COMBINED_TRANSCEND_DATA_FLOWS_FILE=/Users/test/Desktop/data-flows.csv
export TRANSCEND_COOKIES_FILE=/Users/test/Desktop/cookies.csv
export COMBINED_TRANSCEND_COOKIES_FILE=/Users/test/Desktop/cookies.csv
export TRANSCEND_API_KEY=SECRET_FILL_ME
yarn vz-combine-legal-csv-data-flows --legalCsv=$LEGAL_FILE --dataFlowExportCsv=$TRANSCEND_DATA_FLOWS_FILE --output=$COMBINED_TRANSCEND_DATA_FLOWS_FILE
yarn vz-combine-legal-csv-cookies --legalCsv=$LEGAL_FILE --cookieExportCsv=$TRANSCEND_COOKIES_FILE --output=$COMBINED_TRANSCEND_DATA_FLOWS_FILE
yarn tr-upload-data-flows-from-csv --auth=$TRANSCEND_API_KEY --file=$COMBINED_TRANSCEND_DATA_FLOWS_FILE --trackerStatus=LIVE
yarn tr-upload-data-flows-from-csv --auth=$TRANSCEND_API_KEY --file=$COMBINED_TRANSCEND_COOKIES_FILE --trackerStatus=LIVE
```

#### Required Environment Variables

| Argument                             | Description                                                                                                                                                                                | Type               | Is Secret |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | --------- |
| `LEGAL_FILE`                         | Custom Legal CSV file. File format defined by [`LegalTrackerCsvCodec`](https://github.com/transcend-io/vz-cli/blob/757b42301116b551d0a927944e3c4407a802a9de/src/codecs.ts#L6)              | string - file-path | false     |
| `TRANSCEND_DATA_FLOWS_FILE`          | Export of data flows from the Transcend dashboard. File format defined by [`DataFlowCsvInput`](https://github.com/transcend-io/cli/blob/main/src/codecs.ts#L821C14-L847)                   | string - file-path | false     |
| `COMBINED_TRANSCEND_DATA_FLOWS_FILE` | Output file format that can be re-imported into Transcend dashboard. File format defined by [`DataFlowCsvInput`](https://github.com/transcend-io/cli/blob/main/src/codecs.ts#L821C14-L847) | string - file-path | false     |
| `TRANSCEND_COOKIES_FILE`             | Export of cookies from the Transcend dashboard. File format defined by[`CookieCsvInput`](https://github.com/transcend-io/cli/blob/main/src/codecs.ts#L849-L873)                            | string - file-path | false     |
| `COMBINED_TRANSCEND_COOKIES_FILE`    | Output file format that can be re-imported into Transcend dashboard. File format defined by [`CookieCsvInput`](https://github.com/transcend-io/cli/blob/main/src/codecs.ts#L849-L873)      | string - file-path | false     |
| `TRANSCEND_API_URL`                  | Transcend backend URL                                                                                                                                                                      | string - url       | false     |
| `TRANSCEND_API_KEY`                  | Transcend API key with scopes `Manage Cookies`                                                                                                                                             | string - api-key   | true      |

### B) Generate API keys to Synchronize Cross-Account Data

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

### C) Delete API Keys Cross-Account

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

### D) Sync Shared Configuration from `0 - Data Mapping` Across All Accounts

There are some consistent settings that we will apply across all Transcend instances. The set of resource settings that can be pulled can be found here. The resources listed in the command below can be pulled and synced into other instances to enforce a consistent configuration across the privacy request in order to:

- attributes - any custom table columns are defined across the data flows, cookies, privacy requests and data inventory tables
- identifiers - the detected identifiers used to querying users for data deletion
- consentManager - developer settings for the consent manager

A post-processing step is done to remove some data that should not be synced, before that data is pushed back up into other Transcend instances

```sh
export TRANSCEND_API_URL=https://api.us.transcend.io
export TRANSCEND_API_KEY=SECRET_FILL_ME
export TRANSCEND_YAML=./transcend.yml
export TRANSCEND_API_KEYS_PATH=./working/api-keys.json
yarn tr-pull --auth=$TRANSCEND_API_KEY --resources=attributes,identifiers,consentManager --file=$TRANSCEND_YAML
yarn vz-transform-from-parent-for-children --file=$TRANSCEND_YAML
yarn tr-push --auth=$TRANSCEND_API_KEYS_PATH --file=$TRANSCEND_YAML
```

#### Required Environment Variables

| Argument                  | Description                                                                                                                                                     | Type               | Is Secret                                                |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------- |
| `TRANSCEND_YAML`          | Transcend yml file format, defined by [`Transcend Input`](https://github.com/transcend-io/cli/blob/d40546cdfd76639ad1c950f913ca9b426a97895f/src/codecs.ts#L749) | string - file-path | false                                                    |
| `TRANSCEND_API_URL`       | Transcend backend URL                                                                                                                                           | string - url       | false                                                    |
| `TRANSCEND_API_KEY`       | Transcend API key with scopes `Manage Data Flows`                                                                                                               | string - api-key   | true                                                     |
| `TRANSCEND_API_KEYS_PATH` | Path to the JSON file holding the API keys for each instance. This file can be created in section "Generate API keys to Synchronize Cross-Account Data"         | string - file-path | false - file contents are secret (should be git-ignored) |

### E) Pull a `transcend.yml` for Each Instance

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

### F) Combining Configurations Cross-Instances into the `0 - Data Mapping` -> `Data Inventory` -> `Business Entities` table

Take the output of each Transcend instance and combine them into a single YML file to sync into the `0 - Data Mapping` [Business Entities](https://app.transcend.io/data-map/data-inventory/business-entities) table in the Transcend dashboard. This view allows for a summarization of various information across all Transcend instances.

```sh
export TRANSCEND_API_URL=https://api.us.transcend.io
export COMBINED_TRANSCEND_BUSINESS_ENTITIES=/Users/test/Desktop/business-entities-combined.yml
export TRANSCEND_API_KEY=SECRET_FILL_ME
export TRANSCEND_YAML_FOLDER=./working/output/
export TRANSCEND_API_KEYS_PATH=./working/api-keys.json
rm -rf $TRANSCEND_YAML_FOLDER
yarn tr-pull --auth=$TRANSCEND_API_KEYS_PATH --file=$TRANSCEND_YAML_FOLDER --resources=consentManager
yarn tr-consent-managers-to-business-entities --transcendYmlFolder=$TRANSCEND_YAML_FOLDER --output=$COMBINED_TRANSCEND_BUSINESS_ENTITIES
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

### G) Pull Down Approved Data Flows to YAML Cross-Account

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

### H) Generate Cross-Instance List of Ad Tech & Site Tech

Create a single export of ad tech and site tech across all Transcend instances.

1. Pull down the data flows and cookies across all instances
2. Determine the set of Data Silos by looking at the services tied to each data flow and cookie
3. Produce a single `transcend.yml` file with the full set of all Data Silos found from each data flow and cookie
4. Load the `transcend.yml` into the `0 - Data Mapping` Transcend instance.

```sh
export TRANSCEND_API_URL=https://api.us.transcend.io
export TRANSCEND_API_KEYS_PATH=./working/api-keys.json
export TRANSCEND_DATA_FLOWS_YAML_FOLDER=./working/data-flows/
export TRANSCEND_DATA_SILOS_YAML_FILE=./working/data-silos.yml
export TRANSCEND_IGNORE_YMLS="0 - Data Mapping.yml"
export TRANSCEND_API_KEY=SECRET_FILL_ME
yarn tr-pull --auth=$TRANSCEND_API_KEYS_PATH --file=$TRANSCEND_DATA_FLOWS_YAML_FOLDER --resources=dataFlows --trackerStatuses=LIVE
yarn tr-derive-data-silos-from-data-flows-cross-instance --auth=$TRANSCEND_API_KEY --dataFlowsYmlFolder=$TRANSCEND_DATA_FLOWS_YAML_FOLDER --output=$TRANSCEND_DATA_SILOS_YAML_FILE --ignoreYmls=$TRANSCEND_IGNORE_YMLS
yarn tr-push --auth=$TRANSCEND_API_KEY --file=$TRANSCEND_DATA_SILOS_YAML_FOLDER
```

#### Required Environment Variables

| Argument                           | Description                                                                                                                                             | Type                 | Is Secret                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | -------------------------------------------------------- |
| `TRANSCEND_API_URL`                | Transcend backend URL                                                                                                                                   | string - url         | false                                                    |
| `TRANSCEND_API_KEYS_PATH`          | Path to the JSON file holding the API keys for each instance. This file can be created in section "Generate API keys to Synchronize Cross-Account Data" | string - file-path   | false - file contents are secret (should be git-ignored) |
| `TRANSCEND_DATA_FLOWS_YAML_FOLDER` | The folder to write the set of data flow configurations                                                                                                 | string - folder-path | false                                                    |
| `TRANSCEND_DATA_SILOS_YAML_FILE`   | The file to write the set of data silo configurations to                                                                                                | string - file-path   | false                                                    |
| `TRANSCEND_IGNORE_YMLS`            | The yml files that should not be synced                                                                                                                 | string[]             | false                                                    |
| `TRANSCEND_API_KEY`                | Transcend API key with `Manage Data Map` permission for the instance to upload the `TRANSCEND_DATA_SILOS_YAML_FILE` file to                             | string - api-key     | true                                                     |

### I) Generate Per-Instance List of Ad Tech Data Silos

1. Pull down the data flows and cookies across all instances
2. Determine the set of Data Silos for that instance by looking at the services tied to each data flow and cookie
3. Produce a new `transcend.yml` file containing the full set of all Data Silos found from in each instance
4. Load each `transcend.yml` into each respective Transcend instance

```sh
export TRANSCEND_API_URL=https://api.us.transcend.io
export TRANSCEND_API_KEYS_PATH=./working/api-keys.json
export TRANSCEND_DATA_FLOWS_YAML_FOLDER=./working/data-flows/
export TRANSCEND_DATA_SILOS_YAML_FOLDER=./working/data-silos/
export TRANSCEND_IGNORE_YMLS="0 - Data Mapping.yml"
export TRANSCEND_API_KEY=SECRET_FILL_ME
yarn tr-pull --auth=$TRANSCEND_API_KEYS_PATH --file=$TRANSCEND_DATA_FLOWS_YAML_FOLDER --resources=dataFlows --trackerStatuses=LIVE
yarn tr-derive-data-silos-from-data-flows --auth=$TRANSCEND_API_KEY --dataFlowsYmlFolder=$TRANSCEND_DATA_FLOWS_YAML_FOLDER --dataSilosYmlFolder=$TRANSCEND_DATA_SILOS_YAML_FOLDER --ignoreYmls=$TRANSCEND_IGNORE_YMLS
yarn tr-push --auth=$TRANSCEND_API_KEYS_PATH --file=$TRANSCEND_DATA_SILOS_YAML_FOLDER
```

#### Required Environment Variables

| Argument                           | Description                                                                                                                                             | Type                 | Is Secret                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | -------------------------------------------------------- |
| `TRANSCEND_API_URL`                | Transcend backend URL                                                                                                                                   | string - url         | false                                                    |
| `TRANSCEND_API_KEYS_PATH`          | Path to the JSON file holding the API keys for each instance. This file can be created in section "Generate API keys to Synchronize Cross-Account Data" | string - file-path   | false - file contents are secret (should be git-ignored) |
| `TRANSCEND_DATA_FLOWS_YAML_FOLDER` | The folder to write the set of data flow configurations                                                                                                 | string - folder-path | false                                                    |
| `TRANSCEND_DATA_SILOS_YAML_FOLDER` | The folder to write the set of data silo configurations                                                                                                 | string - folder-path | false                                                    |
| `TRANSCEND_IGNORE_YMLS`            | The yml files that should not be synced                                                                                                                 | string[]             | false                                                    |
| `TRANSCEND_API_KEY`                | Any Transcend API key across any instance. No scope required                                                                                            | string - api-key     | true                                                     |

### J) Update the Consent Manager to Latest Cross-Instance

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
