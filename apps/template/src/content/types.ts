export interface VenueSubpageContent {
  venueId: string;
  price: PriceContent;
  howToUse: HowToUseContent;
  etiquette: EtiquetteContent;
  ranking: RankingContent;
  review: ReviewContent;
}

export interface PriceContent {
  intro: string;
  baseRates: { label: string; amount: string; note: string }[];
  timeSlots: { time: string; priceMultiplier: string; description: string }[];
  groupEstimates: { size: string; estimated: string }[];
  tips: string[];
  faqs: { q: string; a: string }[];
}

export interface HowToUseContent {
  intro: string;
  steps: { title: string; description: string; tip?: string }[];
  warnings: string[];
  faqs: { q: string; a: string }[];
}

export interface EtiquetteContent {
  intro: string;
  dressCode: string;
  orderingManners: string;
  tipping: string;
  dos: string[];
  donts: string[];
}

export interface RankingContent {
  intro: string;
  criteria: string[];
  items: { rank: number; name: string; description: string; highlights: string[] }[];
  comparisonTable: { feature: string; values: string[] }[];
}

export interface ReviewContent {
  intro: string;
  aggregateRating: { value: number; count: number };
  reviews: { author: string; date: string; rating: number; text: string }[];
}

export interface SituationalGuideContent {
  slug: string;
  titleTemplate: string;
  intro: string;
  recommendations: { venueType: string; reason: string; priceRange: string }[];
  courseSuggestion: { step: string; venue: string; duration: string }[];
  budgetGuide: string;
  bookingTips: string[];
  relatedGuidesSlugs: string[];
}

export interface GlossaryTerm {
  term: string;
  reading?: string;
  definition: string;
  relatedVenues: string[];
  relatedPageSlugs: string[];
}

export interface ComparisonContent {
  venue1Id: string;
  venue2Id: string;
  intro: string;
  dimensions: { dimension: string; venue1: string; venue2: string }[];
  situationalRecommendation: string;
  faqs: { q: string; a: string }[];
}

export interface StationGuideContent {
  stationSlug: string;
  intro: string;
  areaDescription: string;
  accessInfo: string;
  venueOverview: { venueType: string; description: string; recommended: boolean }[];
  hotspots: string[];
  courseSuggestion: { step: string; venue: string; duration: string }[];
  faqs: { q: string; a: string }[];
}

export interface StationVenueContent {
  stationSlug: string;
  venueType: string;
  intro: string;
  features: string[];
  priceRange: string;
  recommendations: string[];
}
