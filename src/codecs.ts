import * as t from 'io-ts';

/**
 * The shape of the legal CSV file that holds a list of tracking information
 */
export const LegalTrackerCsvCodec = t.type({
  /** Tracker domain being classified */
  'Tracker Domain': t.string,
  /** Organization ID API key is for */
  'CPRA Language': t.string,
});

/** Type override */
export type LegalTrackerCsvCodec = t.TypeOf<typeof LegalTrackerCsvCodec>;
