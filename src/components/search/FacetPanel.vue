<script setup lang="ts">
import FacetGroup from "@/components/search/FacetGroup.vue";
import type { FacetGroup as FacetGroupType } from "@/types/crossref";
import { computed } from "vue";

const props = defineProps<{
  facets: FacetGroupType[];
  hasActiveFilters: boolean;
}>();

const visibleFacets = computed(() =>
  props.facets.filter((g) => g.options.length > 0),
);

const emit = defineEmits<{
  toggle: [facetName: string, value: string];
  "clear-filters": [];
}>();
</script>

<template>
  <aside class="facet-panel" aria-label="Search filters">
    <div class="facet-panel__header">
      <h2 class="facet-panel__heading">Filters</h2>
      <button
        v-if="hasActiveFilters"
        class="facet-panel__clear"
        type="button"
        @click="emit('clear-filters')"
      >
        Clear all
      </button>
    </div>
    <div class="facet-panel__groups">
      <FacetGroup
        v-for="group in visibleFacets"
        :key="group.name"
        :title="group.displayName"
        :options="group.options"
        :facet-name="group.name"
        @toggle="
          (facetName: string, value: string) => emit('toggle', facetName, value)
        "
      />
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.facet-panel {
  @media (min-width: $breakpoint-lg) {
    position: sticky;
    top: 7rem;
    align-self: start;
    max-height: calc(100dvh - 8rem);
    overflow-y: auto;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-lg;
  }

  &__heading {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-black;
  }

  &__clear {
    font-size: $font-size-xs;
    color: $color-red;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: color $transition-fast;

    &:hover {
      color: $color-dark-red;
    }

    &:active {
      transform: translateY(1px);
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__groups {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-xl;

    @media (min-width: $breakpoint-lg) {
      grid-template-columns: 1fr;
    }
  }
}
</style>
