<script setup lang="ts">
import IconCheck from "@/components/icons/IconCheck.vue";

const model = defineModel<boolean>({ required: true })

defineProps<{
  label: string
  id: string
  disabled?: boolean
  count?: number
}>()

function formatCount(count: number): string {
  return count.toLocaleString()
}
</script>

<template>
  <div
    class="base-checkbox"
    :class="{ 'base-checkbox--disabled': disabled }"
  >
    <input
      :id="id"
      v-model="model"
      type="checkbox"
      :disabled="disabled"
      class="base-checkbox__input"
    >
    <label
      :for="id"
      class="base-checkbox__label"
    >
      <span
        class="base-checkbox__box"
        aria-hidden="true"
      >
        <IconCheck
          v-if="model"
          class="base-checkbox__check"
        />
      </span>
      <span class="base-checkbox__text">{{ label }}</span>
      <span
        v-if="count !== undefined"
        class="base-checkbox__count"
      >
        ({{ formatCount(count) }})
      </span>
    </label>
  </div>
</template>

<style lang="scss" scoped>
.base-checkbox {
  &__input {
    @include visually-hidden;

    &:focus-visible + .base-checkbox__label .base-checkbox__box {
      @include focus-ring;
    }

    &:checked + .base-checkbox__label .base-checkbox__box {
      background-color: $color-dark-blue;
      border-color: $color-dark-blue;
      color: $color-white;
    }
  }

  &__label {
    display: inline-flex;
    align-items: center;
    gap: $spacing-sm;
    cursor: pointer;
    font-size: $font-size-sm;
    line-height: $line-height-base;
    color: $color-black;
  }

  &__box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.125rem;
    height: 1.125rem;
    flex-shrink: 0;
    border: 1.5px solid $color-border;
    border-radius: $radius-sm;
    background-color: $color-white;
    transition: background-color $transition-fast, border-color $transition-fast;
  }

  &__label:hover .base-checkbox__box {
    border-color: $color-blue;
  }

  &__check {
    width: 0.75rem;
    height: 0.75rem;
  }

  &__text {
    flex: 1;
    min-width: 0;
  }

  &__count {
    color: $color-grey;
    font-size: $font-size-xs;
    white-space: nowrap;
  }

  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
