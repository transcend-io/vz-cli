#!/usr/bin/env/node
import difference from 'lodash/difference';
import yargs from 'yargs-parser';
import colors from 'colors';

import {
  readCsv,
  readTranscendYaml,
  writeTranscendYaml,
} from '@transcend-io/cli';
import { logger } from './logger';
import { LegalTrackerCsvCodec } from './codecs';

/**
 * Combines information in a CSV from a legal team into a CSV of data flow data
 *
 * yarn ts-node ./src/cli-combine-legal-csv-data-flows.ts \
 *   --legalCsv=/Users/michaelfarrell/Desktop/legal.csv \
 *   --dataFlowYml=/Users/michaelfarrell/Desktop/transcend.yml
 *   --output=/Users/michaelfarrell/Desktop/transcend-output.yml
 *
 * Standard usage:
 * yarn vz-combine-legal-csv-data-flows \
 *   --legalCsv=/Users/michaelfarrell/Desktop/legal.csv \
 *   --dataFlowYml=/Users/michaelfarrell/Desktop/transcend.yml \
 *   --output=/Users/michaelfarrell/Desktop/transcend-output.yml
 */
function main(): void {
  // Parse command line arguments
  const {
    legalCsv = './legalMaster.csv',
    dataFlowYml = './transcend.yml',
    output = './transcend.yml',
  } = yargs(process.argv.slice(2)) as { [k in string]: string };

  /**
   * NOTES: This first part here is reading in the legal CSV file and extracting
   * information from each row on a domain and a CPRA Language field, which is where they
   * are putting SaleOfInfo or something like it. Stores into the map `legalDecisions`
   */
  logger.info(colors.magenta(`Reading in legal decisions from "${legalCsv}"`));
  const csvData = readCsv(legalCsv, LegalTrackerCsvCodec);
  const legalDecisions = csvData.reduce(
    (acc, row) =>
      Object.assign(acc, {
        [row['Tracker Domain']]: row['CPRA Language'],
      }),
    {} as { [k in string]: string },
  );

  // Read in YML
  logger.info(
    colors.magenta(
      `Reading file located at "${dataFlowYml}" and updating with info from the legal team decisions`,
    ),
  );
  const dataFlowExportData = readTranscendYaml(dataFlowYml);

  (dataFlowExportData['data-flows'] || []).forEach((row) => {
    const { value, trackingPurposes, status } = row;
    // split the data flow into sub-paths
    const dataFlowParts = value.split('.');

    // check if the legal rule matches any sub-paths
    for (let i = dataFlowParts.length; i > 1; i -= 1) {
      // construct sub-domain
      const domainPart = dataFlowParts.slice(-i).join('.');

      // check if legal csv has decision
      const relevantLegalDecision = legalDecisions[domainPart];

      // Update data flow if decision is changed
      if (relevantLegalDecision) {
        const newPurposes = relevantLegalDecision.split(',');
        logger.info(
          `Found a legal decision for "${value}" under "${domainPart}". \n    ` +
            `Old purpose in Transcend "${trackingPurposes?.join(',')}"\n    ` +
            `new purpose in legal sheet is: "${newPurposes.join(',')}"\n    ` +
            `Old data flow status is: ${status}\n    ` +
            'New data flow status is: LIVE\n    ' +
            `Data flow is being updated by this script?: ${
              status !== 'LIVE' ||
              difference(newPurposes, trackingPurposes || []).length > 0 ||
              difference(trackingPurposes || [], newPurposes).length > 0
            }`,
        );

        // updating
        // eslint-disable-next-line no-param-reassign
        row.trackingPurposes = newPurposes;
        // eslint-disable-next-line no-param-reassign
        row.status = 'LIVE';

        // no need to keep for-loop going
        return;
      }
    }
  });

  /**
   * NOTES: At the end, writes out a new CSV file with the changes
   */
  writeTranscendYaml(output, dataFlowExportData);
  logger.info(colors.green(`Wrote results to "${output}"`));
}

main();
