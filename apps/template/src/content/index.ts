import { venueContentsPart1 } from './venue-subpages-part1';
import { venueContentsPart2 } from './venue-subpages-part2';
import { venueContentsPart3 } from './venue-subpages-part3';
import { venueContentsPart4 } from './venue-subpages-part4';
import { venueContentsPart5 } from './venue-subpages-part5';
import { venueContentsPart6 } from './venue-subpages-part6';
import { venueContentsPart7 } from './venue-subpages-part7';
import type { VenueSubpageContent } from './types';

export * from './types';
export { getSituationalGuideContent, getAllSituationalGuides, SITUATIONAL_GUIDE_SLUGS } from './situational-guides';
export { getComparisonContent, getAllComparisons } from './venue-comparisons';
export { getAllGlossaryTerms, getGlossaryTermsByVenue } from './glossary-terms';
export { getStationGuideContent, getStationVenueContent } from './station-guides';

const allVenueContents: Record<string, VenueSubpageContent> = {
  ...venueContentsPart1,
  ...venueContentsPart2,
  ...venueContentsPart3,
  ...venueContentsPart4,
  ...venueContentsPart5,
  ...venueContentsPart6,
  ...venueContentsPart7,
};

export function getVenueContent(venueId: string): VenueSubpageContent | undefined {
  return allVenueContents[venueId];
}
