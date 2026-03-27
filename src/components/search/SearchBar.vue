<script setup lang="ts">
import IconSearch from "@/components/icons/IconSearch.vue";

const model = defineModel<string>({ required: true })

defineProps<{
  isLoading: boolean
}>()

const emit = defineEmits<{
  submit: []
}>()
</script>

<template>
  <form
    class="search-bar"
    role="search"
    @submit.prevent="emit('submit')"
  >
    <div class="search-bar__wrapper">
      <IconSearch class="search-bar__icon" />
      <input
        v-model="model"
        type="search"
        class="search-bar__input"
        placeholder="Title, author, DOI, ORCID iD, etc."
        aria-label="Search Crossref metadata"
      >
    </div>
  </form>
</template>

<style lang="scss" scoped>
.search-bar {
  width: 100%;

  &__wrapper {
    position: relative;
    width: 100%;
  }

  &__icon {
    position: absolute;
    left: $spacing-md;
    top: 50%;
    transform: translateY(-50%);
    color: $color-grey;
    pointer-events: none;
  }

  &__input {
    width: 100%;
    padding: $spacing-sm $spacing-md $spacing-sm 3rem;
    font-family: $font-family-base;
    font-size: $font-size-base;
    color: $color-black;
    background-color: $color-white;
    border: 2px solid $color-border;
    border-radius: $radius-md;
    transition: border-color $transition-fast, box-shadow $transition-fast;

    &::placeholder {
      color: $color-grey;
      opacity: 0.7;
    }

    &:hover {
      border-color: $color-grey;
    }

    &:focus-visible {
      outline: none;
      border-color: $color-blue;
      box-shadow: 0 0 0 3px rgba($color-blue, 0.15);
    }
  }
}
</style>
