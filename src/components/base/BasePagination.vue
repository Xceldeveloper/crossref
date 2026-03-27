<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  "page-change": [page: number];
}>();

const WINDOW = 2;

const pageRange = computed(() => {
  const total = props.totalPages;
  const current = props.currentPage;
  const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];

  pages.push(1);

  const rangeStart = Math.max(2, current - WINDOW);
  const rangeEnd = Math.min(total - 1, current + WINDOW);

  if (rangeStart > 2) pages.push("ellipsis-start");

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  if (rangeEnd < total - 1) pages.push("ellipsis-end");

  if (total > 1) pages.push(total);

  return pages;
});
</script>

<template>
  <nav class="base-pagination" aria-label="Search results pagination">
    <div class="base-pagination__controls">
      <button
        class="base-pagination__arrow"
        :disabled="currentPage <= 1"
        aria-label="Go to previous page"
        @click="emit('page-change', currentPage - 1)"
      >
        &laquo;
      </button>
      <template v-for="page in pageRange" :key="page">
        <span
          v-if="page === 'ellipsis-start' || page === 'ellipsis-end'"
          class="base-pagination__ellipsis"
        >
          &hellip;
        </span>
        <button
          v-else
          class="base-pagination__page"
          :class="{ 'base-pagination__page--active': page === currentPage }"
          :aria-label="`Go to page ${page}`"
          :aria-current="page === currentPage ? 'page' : undefined"
          :disabled="page === currentPage"
          @click="emit('page-change', page as number)"
        >
          {{ page }}
        </button>
      </template>
      <button
        class="base-pagination__arrow"
        :disabled="currentPage >= totalPages"
        aria-label="Go to next page"
        @click="emit('page-change', currentPage + 1)"
      >
        &raquo;
      </button>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.base-pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  padding-top: $spacing-lg;
  border-top: 1px solid $color-border;

  @media (min-width: $breakpoint-lg) {
    align-items: flex-start;
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    flex-wrap: wrap;
  }

  &__arrow,
  &__page {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2.25rem;
    height: 2.25rem;
    padding: 0 $spacing-sm;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    background: $color-white;
    color: $color-dark-blue;
    cursor: pointer;
    transition:
      background-color $transition-fast,
      border-color $transition-fast,
      color $transition-fast,
      transform $transition-fast;

    &:hover:not(:disabled) {
      background-color: $color-bg;
      border-color: $color-dark-blue;
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
    }

    &:focus-visible {
      @include focus-ring;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  &__page--active {
    background-color: $color-dark-blue;
    border-color: $color-dark-blue;
    color: $color-white;
    cursor: default;

    &:disabled {
      opacity: 1;
    }
  }

  &__ellipsis {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2.25rem;
    height: 2.25rem;
    font-size: $font-size-sm;
    color: $color-grey;
    user-select: none;
  }
}
</style>
