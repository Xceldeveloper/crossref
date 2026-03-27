<script setup lang="ts">
import SearchResultCard from "@/components/search/SearchResultCard.vue";
import BasePagination from "@/components/base/BasePagination.vue";
import type { CrossrefWork, SortField } from "@/types/crossref";

defineProps<{
  results: CrossrefWork[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  sort: SortField;
}>();

const emit = defineEmits<{
  "page-change": [page: number];
  "sort-change": [field: SortField];
}>();
</script>

<template>
  <div class="search-results">
    <div
      v-if="!hasSearched && !isLoading && !error"
      class="search-results__empty"
    >
      <h2 class="search-results__empty-title">
        Search the Crossref metadata registry
      </h2>
      <p class="search-results__empty-text">
        Find scholarly works, journal articles, books, datasets, and more from
        over 150 million records.
      </p>
    </div>

    <div v-else-if="isLoading" class="search-results__loading" aria-busy="true">
      <div aria-live="polite" class="search-results__sr-only">
        Loading results...
      </div>
      <div v-for="n in 5" :key="n" class="search-results__skeleton">
        <div class="search-results__skeleton-tag" />
        <div class="search-results__skeleton-title" />
        <div class="search-results__skeleton-text" />
        <div
          class="search-results__skeleton-text search-results__skeleton-text--short"
        />
      </div>
    </div>

    <div v-else-if="error" class="search-results__error" role="alert">
      <p class="search-results__error-message">
        {{ error }}
      </p>
      <p class="search-results__error-hint">
        Try adjusting your search terms or removing some filters.
      </p>
    </div>

    <div
      v-else-if="hasSearched && results.length === 0"
      class="search-results__empty"
    >
      <h2 class="search-results__empty-title">No results found</h2>
      <p class="search-results__empty-text">
        Try broadening your search or removing some filters.
      </p>
    </div>

    <template v-else>
      <div class="search-results__toolbar">
        <div class="search-results__sort">
          <span class="search-results__sort-label">Sort by:</span>
          <button
            class="search-results__sort-option"
            :class="{
              'search-results__sort-option--active': sort === 'relevance',
            }"
            :aria-current="sort === 'relevance' ? 'true' : undefined"
            @click="emit('sort-change', 'relevance')"
          >
            relevance
          </button>
          <button
            class="search-results__sort-option"
            :class="{
              'search-results__sort-option--active': sort === 'published',
            }"
            :aria-current="sort === 'published' ? 'true' : undefined"
            @click="emit('sort-change', 'published')"
          >
            publication year
          </button>
        </div>
        <span aria-live="polite" class="search-results__page-info">
          Page {{ currentPage.toLocaleString() }} of
          {{ totalResults.toLocaleString() }} results
        </span>
      </div>
      <div class="search-results__list">
        <SearchResultCard
          v-for="work in results"
          :key="work.DOI"
          :work="work"
        />
      </div>
      <BasePagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="emit('page-change', $event)"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.search-results {
  &__empty,
  &__error {
    padding: $spacing-2xl $spacing-md;
    text-align: center;
  }

  &__empty-title {
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $color-black;
    margin-bottom: $spacing-sm;
  }

  &__empty-text,
  &__error-hint {
    font-size: $font-size-base;
    color: $color-grey;
    max-width: 45ch;
    margin-inline: auto;
  }

  &__error-message {
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    color: $color-red;
    margin-bottom: $spacing-sm;
  }

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: $spacing-sm;
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid $color-border;
  }

  &__page-info {
    font-size: $font-size-xs;
    color: $color-grey;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  &__sort {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: $font-size-xs;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  &__sort-label {
    color: $color-grey;
    font-weight: $font-weight-medium;
  }

  &__sort-option {
    background: none;
    border: none;
    padding: $spacing-xs;
    font-size: $font-size-xs;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: $color-dark-blue;
    cursor: pointer;
    border-radius: $radius-sm;
    transition: color $transition-fast;

    &:hover {
      text-decoration: underline;
    }

    &:active {
      transform: translateY(1px);
    }

    &:focus-visible {
      @include focus-ring;
    }

    &--active {
      font-weight: $font-weight-bold;
      color: $color-black;
      cursor: default;

      &:hover {
        text-decoration: none;
      }

      &:active {
        transform: none;
      }
    }
  }

  &__sr-only {
    @include visually-hidden;
  }

  &__loading {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  &__skeleton {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    padding: $spacing-lg 0;
    border-bottom: 1px solid $color-border;
  }

  &__skeleton-tag {
    width: 6rem;
    height: 1.25rem;
    background: linear-gradient(
      90deg,
      $color-border 25%,
      $color-bg 50%,
      $color-border 75%
    );
    background-size: 200% 100%;
    border-radius: $radius-sm;
    animation: shimmer 1.5s ease infinite;
  }

  &__skeleton-title {
    width: 80%;
    height: 1.5rem;
    background: linear-gradient(
      90deg,
      $color-border 25%,
      $color-bg 50%,
      $color-border 75%
    );
    background-size: 200% 100%;
    border-radius: $radius-sm;
    animation: shimmer 1.5s ease infinite;
  }

  &__skeleton-text {
    width: 60%;
    height: 1rem;
    background: linear-gradient(
      90deg,
      $color-border 25%,
      $color-bg 50%,
      $color-border 75%
    );
    background-size: 200% 100%;
    border-radius: $radius-sm;
    animation: shimmer 1.5s ease infinite;

    &--short {
      width: 40%;
    }
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
