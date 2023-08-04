#!/usr/bin/env/node

import yargs from 'yargs-parser';
import colors from 'colors';

import { readCsv, DataFlowCsvInput, writeCsv } from '@transcend-io/cli';
import { logger } from './logger';
import { LegalTrackerCsvCodec } from './codecs';

/**
 * Combines information in a CSV from a legal team into a CSV of data flow data
 *
 * yarn ts-node ./src/cli-combine-legal-csv-data-flows.ts \
 *   --legalCsv=/Users/michaelfarrell/Desktop/legal.csv \
 *   --dataFlowExportCsv=/Users/michaelfarrell/Desktop/data-flows.csv
 *   --output=/Users/michaelfarrell/Desktop/output.csv
 *
 * Standard usage:
 * yarn vz-combine-legal-csv-data-flows \
 *   --legalCsv=/Users/michaelfarrell/Desktop/legal.csv \
 *   --dataFlowExportCsv=/Users/michaelfarrell/Desktop/data-flows.csv \
 *   --output=/Users/michaelfarrell/Desktop/output.csv
 */
function main(): void {
  // Parse command line arguments
  const {
    legalCsv = './legalMaster.csv',
    dataFlowExportCsv = './triage-data-flows.csv',
    output = './combined.csv',
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
    new Map<string, string>(),
  );

  logger.info(
    colors.magenta(
      `Reading file located at "${dataFlowExportCsv}" and updating with info from the legal team decisions`,
    ),
  );
  const dataFlowExportData = readCsv(legalCsv, DataFlowCsvInput);

  /**
   * NOTES: This deeply nested, hacky blob of code reads through the dataFlowExportCsv file, which
   * is expected to be in the format that tr-upload-data-flows-from-csv expects, which is also the format
   * that is exported from the Admin Dashboard. We look at each row and try to determine if we should override
   * the `Status` column if the legal sheet gave an authoritative answer on either the domain, or any parent
   * domain of the domain in that row, which is a feature explicitly requested.
   */
  const records: DataFlowCsvInput[] = [];
  dataFlowExportData.forEach((row) => {
    const dataFlow = row['Connections Made To'];
    const dataFlowParts = dataFlow.split('.');
    for (let i = dataFlowParts.length; i > 1; i -= 1) {
      const domainPart = dataFlowParts.slice(-i).join('.');
      const relevantLegalDecision = legalDecisions.get(domainPart);
      if (relevantLegalDecision) {
        logger.info(
          // eslint-disable-next-line max-len
          `Found a legal decision for "${dataFlow}" under "${domainPart}". Old status was "${row.Purpose}", new is "${relevantLegalDecision}"`,
        );
        records.push({
          ...row,
          Purpose: relevantLegalDecision ?? row.Purpose,
          /** If a legal decision was made, make the data flow live */
          Status:
            relevantLegalDecision !== undefined
              ? 'LIVE'
              : row.Status || 'NEEDS_REVIEW',
        });
        return;
      }
    }
  });

  /**
   * NOTES: At the end, writes out a new CSV file with the changes
   */
  writeCsv(output, records);
}

main();
