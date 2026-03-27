import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { searchWorks } from "@/services/crossref";
import { HttpError } from "@/services/http";
import { logger } from "@/utils/logger";
import type {
  CrossrefWork,
  CrossrefFacet,
  FacetGroup,
  FacetOption,
  SearchFilters,
  SortField,
} from "@/types/crossref";

const ROWS_PER_PAGE = 10;
const MAX_FACET_OPTIONS = 15;

// Single source of truth for facets — add a new entry here to support a new facet everywhere
const FACET_CONFIG = [
  {
    key: "type-name",
    displayName: "Type",
    urlKey: "type-name",
    sortEntries: ([, a]: [string, number], [, b]: [string, number]) => b - a,
    buildFilter: (values: string[]) => values.map((v) => `type-name:${v}`),
  },
  {
    key: "published",
    displayName: "Year",
    urlKey: "year",
    sortEntries: ([a]: [string, number], [b]: [string, number]) => Number(b) - Number(a),
    // API only supports date ranges, not OR — so multi-year uses min/max
    buildFilter: (values: string[]) => {
      if (values.length === 0) return [];
      const sorted = [...values].sort();
      return [`from-pub-date:${sorted[0]}`, `until-pub-date:${sorted[sorted.length - 1]}`];
    },
  },
];

// Derived from config — e.g. "type-name:*,published:*"
const FACETS_PARAM = FACET_CONFIG.map((c) => `${c.key}:*`).join(",");

function buildFacetGroup(raw: CrossrefFacet, selected: string[], config: (typeof FACET_CONFIG)[number]): FacetGroup {
  const entries = Object.entries(raw.values);
  const apiKeys = new Set(entries.map(([k]) => k));

  const options: FacetOption[] = entries
    .sort(config.sortEntries)
    .slice(0, MAX_FACET_OPTIONS)
    .map(([label, count]) => ({ label, count, selected: selected.includes(label) }));

  // Re-inject selected options the API may have dropped from the filtered response
  for (const val of selected) {
    if (!apiKeys.has(val)) options.push({ label: val, count: 0, selected: true });
  }

  return { name: config.key, displayName: config.displayName, options };
}

// vue-router returns string for single values, string[] for repeated keys
function toStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter((v): v is string => typeof v === "string");
  if (typeof val === "string") return [val];
  return [];
}

function buildFilterString(filters: SearchFilters): string {
  return FACET_CONFIG.flatMap((c) => c.buildFilter(filters[c.key] ?? [])).join(",");
}

function emptyFilters(): SearchFilters {
  return Object.fromEntries(FACET_CONFIG.map((c) => [c.key, []]));
}

export function useSearch() {
  const route = useRoute();
  const router = useRouter();

  // Seed state from URL so shared links restore the full search context
  const query = ref((route.query.q as string) ?? "");
  const sort = ref<SortField>(route.query.sort === "year" ? "published" : ((route.query.sort as SortField) || "relevance"));
  const currentPage = ref(Number(route.query.page) || 1);
  const filters = ref<SearchFilters>(
    Object.fromEntries(FACET_CONFIG.map((c) => [c.key, toStringArray(route.query[c.urlKey])])),
  );

  const results = ref<CrossrefWork[]>([]);
  const facets = ref<FacetGroup[]>([]);
  const totalResults = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const hasSearched = ref(false);

  const totalPages = computed(() => Math.min(Math.ceil(totalResults.value / ROWS_PER_PAGE), 10));

  if (query.value) search(currentPage.value);

  function syncUrl() {
    const q: Record<string, string | string[]> = {};
    if (query.value.trim()) q.q = query.value.trim();
    if (sort.value !== "relevance") q.sort = sort.value === "published" ? "year" : sort.value;
    if (currentPage.value > 1) q.page = String(currentPage.value);
    for (const c of FACET_CONFIG) {
      const values = filters.value[c.key];
      if (values?.length) q[c.urlKey] = values;
    }
    router.replace({ query: q });
  }

  // Defaults to page 1 — only goToPage passes a specific page
  async function search(page = 1) {
    const q = query.value.trim();
    if (!q) return;

    currentPage.value = page;
    isLoading.value = true;
    error.value = null;

    try {
      const offset = (currentPage.value - 1) * ROWS_PER_PAGE;
      const data = await searchWorks(q, FACETS_PARAM, buildFilterString(filters.value), ROWS_PER_PAGE, offset, sort.value);

      results.value = data.message.items;
      totalResults.value = data.message["total-results"];
      hasSearched.value = true;

      const raw = data.message.facets;
      facets.value = FACET_CONFIG
        .filter((c) => raw[c.key])
        .map((c) => buildFacetGroup(raw[c.key]!, filters.value[c.key] ?? [], c));

      syncUrl();
    } catch (err) {
      error.value = err instanceof HttpError ? err.message : "An unexpected error occurred. Please try again.";
      logger.error("Search failed:", err);
    } finally {
      isLoading.value = false;
    }
  }

  function toggleFilter(facetName: string, value: string) {
    const list = filters.value[facetName] ?? [];
    filters.value[facetName] = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    search();
  }

  function clearFilters() {
    filters.value = emptyFilters();
    search();
  }

  function goToPage(page: number) {
    search(page);
  }

  function setSort(field: SortField) {
    sort.value = field;
    search();
  }

  return {
    query, results, facets, totalResults, currentPage, totalPages,
    isLoading, error, hasSearched, filters, sort,
    search, toggleFilter, clearFilters, goToPage, setSort,
  };
}
