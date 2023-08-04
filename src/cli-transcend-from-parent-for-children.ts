#!/usr/bin/env/node
import { readTranscendYaml, writeTranscendYaml } from '@transcend-io/cli';
import yargs from 'yargs-parser';
import colors from 'colors';
import { logger } from './logger';

/**
 * Combines information in a CSV from a legal team into a CSV of data flow data
 *
 * yarn ts-node ./src/cli-transcend-from-parent-for-children.ts --file=./transcend.yml
 *
 * Standard usage:
 * yarn vz-transcend-from-parent-for-children --file=./transcend.yml
 */
function main(): void {
  // Parse command line arguments
  const { file = './transcend.yml' } = yargs(process.argv.slice(2)) as {
    [k in string]: string;
  };

  // Read in contents
  logger.info(colors.magenta(`Reading file located at "${file}"`));
  const transcend = readTranscendYaml(file);

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
  writeTranscendYaml(file, transcend);
}

main();
