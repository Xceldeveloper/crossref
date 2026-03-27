export interface CrossrefResponse {
  status: string;
  "message-type": string;
  "message-version": string;
  message: CrossrefMessage;
}

export interface CrossrefMessage {
  facets: CrossrefFacets;
  "total-results": number;
  items: CrossrefWork[];
  "items-per-page": number;
  query: {
    "start-index": number;
    "search-terms": string | null;
  };
}

export interface CrossrefFacets {
  [key: string]: CrossrefFacet | undefined;
}

export interface CrossrefFacet {
  "value-count": number;
  values: Record<string, number>;
}

export interface CrossrefWork {
  DOI: string;
  URL: string;
  type: string;
  title: string[];
  "container-title": string[];
  author?: CrossrefAuthor[];
  editor?: CrossrefAuthor[];
  published?: CrossrefDateField;
  "published-print"?: CrossrefDateField;
  "published-online"?: CrossrefDateField;
  issued?: CrossrefDateField;
  publisher?: string;
  score: number;
  "is-referenced-by-count": number;
}

export interface CrossrefAuthor {
  given?: string;
  family?: string;
  name?: string;
  sequence: "first" | "additional";
  affiliation: Array<{ name: string }>;
}

export interface CrossrefDateField {
  "date-parts": number[][];
}

export interface FacetOption {
  label: string;
  count: number;
  selected: boolean;
}

export interface FacetGroup {
  name: string;
  displayName: string;
  options: FacetOption[];
}

export type SearchFilters = Record<string, string[]>;

export type SortField = "relevance" | "published";
