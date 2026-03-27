<script setup lang="ts">
import { ref, computed } from "vue";
import BaseCheckbox from "@/components/base/BaseCheckbox.vue";
import type { FacetOption } from "@/types/crossref";

const props = defineProps<{
  title: string;
  options: FacetOption[];
  facetName: string;
}>();

const emit = defineEmits<{
  toggle: [facetName: string, value: string];
}>();

const INITIAL_SHOW = 10;
const isExpanded = ref(false);

const visibleOptions = computed(() =>
  isExpanded.value ? props.options : props.options.slice(0, INITIAL_SHOW),
);

const hasMore = computed(() => props.options.length > INITIAL_SHOW);
</script>

<template>
  <fieldset class="facet-group">
    <legend class="facet-group__title">
      {{ title }}
    </legend>
    <div class="facet-group__options">
      <BaseCheckbox
        v-for="option in visibleOptions"
        :id="`${facetName}-${option.label}`"
        :key="`${facetName}-${option.label}`"
        :model-value="option.selected"
        :label="option.label"
        :count="option.count"
        @update:model-value="emit('toggle', facetName, option.label)"
      />
    </div>
    <button
      v-if="hasMore"
      class="facet-group__toggle"
      type="button"
      @click="isExpanded = !isExpanded"
    >
      {{ isExpanded ? "Show less" : `Show all ${options.length}` }}
    </button>
  </fieldset>
</template>

<style lang="scss" scoped>
.facet-group {
  &__title {
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: $color-grey;
    margin-bottom: $spacing-sm;
  }

  &__options {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__toggle {
    margin-top: $spacing-sm;
    font-size: $font-size-xs;
    color: $color-dark-blue;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: color $transition-fast;

    &:hover {
      color: $color-blue;
    }

    &:active {
      transform: translateY(1px);
    }

    &:focus-visible {
      @include focus-ring;
    }
  }
}
</style>
