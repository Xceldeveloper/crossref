<script setup lang="ts">
import { computed } from "vue";
import { useSearch } from "@/composables/useSearch";
import SearchLayout from "@/components/layouts/SearchLayout.vue";
import SearchBar from "@/components/search/SearchBar.vue";
import FacetPanel from "@/components/search/FacetPanel.vue";
import SearchResultsList from "@/components/search/SearchResultsList.vue";

const {
  query,
  results,
  facets,
  totalResults,
  currentPage,
  totalPages,
  isLoading,
  error,
  hasSearched,
  filters,
  sort,
  search,
  toggleFilter,
  clearFilters,
  goToPage,
  setSort,
} = useSearch();

const hasActiveFilters = computed(
  () => Object.values(filters.value).some((list) => list.length > 0),
);

const showFacets = computed(
  () => facets.value.length > 0 && (hasSearched.value || isLoading.value),
);
</script>

<template>
  <SearchLayout :has-sidebar="showFacets">
    <template #header>
      <SearchBar
        v-model="query"
        :is-loading="isLoading"
        @submit="search"
      />
    </template>

    <template
      v-if="showFacets"
      #sidebar
    >
      <FacetPanel
        :facets="facets"
        :has-active-filters="hasActiveFilters"
        @toggle="toggleFilter"
        @clear-filters="clearFilters"
      />
    </template>

    <template #content>
      <SearchResultsList
        :results="results"
        :is-loading="isLoading"
        :error="error"
        :has-searched="hasSearched"
        :total-results="totalResults"
        :current-page="currentPage"
        :total-pages="totalPages"
        :sort="sort"
        @page-change="goToPage"
        @sort-change="setSort"
      />
    </template>
  </SearchLayout>
</template>
