<script setup lang="ts">
import type { CrossrefWork, CrossrefAuthor } from "@/types/crossref";
import IconExternalLink from "@/components/icons/IconExternalLink.vue";
import IconChevronDown from "@/components/icons/IconChevronDown.vue";

defineProps<{
  work: CrossrefWork;
}>();

function formatType(type: string): string {
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatNames(people?: CrossrefAuthor[]): string {
  if (!people?.length) return "";
  const MAX = 5;
  const names = people.slice(0, MAX).map((a) => {
    if (a.name) return a.name;
    return [a.given, a.family].filter(Boolean).join(" ");
  });
  if (people.length > MAX) {
    names.push(`+${people.length - MAX} more`);
  }
  return names.join(" | ");
}

function getPublishedLabel(work: CrossrefWork): string {
  const dateField =
    work.published ??
    work["published-print"] ??
    work["published-online"] ??
    work.issued;
  const parts = dateField?.["date-parts"]?.[0];
  if (!parts?.[0]) return "";
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  if (month && day) {
    const d = new Date(year, month - 1, day);
    return ` ${d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;
  }
  if (month) {
    const d = new Date(year, month - 1);
    return ` ${d.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`;
  }
  return ` ${year}`;
}
</script>

<template>
  <article class="result-card">
    <h3 class="result-card__title">
      {{ work.title[0] ?? "Untitled" }}
    </h3>
    <div class="result-card__meta">
      <span class="result-card__type">{{ formatType(work.type) }}</span>
      published
      <span v-if="getPublishedLabel(work)" class="result-card__published">
        {{ getPublishedLabel(work) }}
      </span>
      <span v-if="work['container-title']?.[0]" class="result-card__container">
        in <strong>{{ work["container-title"][0] }}</strong>
      </span>
    </div>
    <p v-if="formatNames(work.author)" class="result-card__people">
      <span class="result-card__people-label"
        >{{ (work.author?.length ?? 0) > 1 ? "Authors" : "Author" }}:</span
      >
      {{ formatNames(work.author) }}
    </p>
    <p v-if="formatNames(work.editor)" class="result-card__people">
      <span class="result-card__people-label"
        >{{ (work.editor?.length ?? 0) > 1 ? "Editors" : "Editor" }}:</span
      >
      {{ formatNames(work.editor) }}
    </p>
    <div class="result-card__footer">
      <a
        :href="work.URL"
        class="result-card__doi"
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconExternalLink class="result-card__link-icon" />
        https://doi.org/{{ work.DOI }}
        <span class="result-card__sr-only">(opens in new tab)</span>
      </a>
      <button class="result-card__actions" type="button">
        Actions
        <IconChevronDown />
      </button>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.result-card {
  padding: $spacing-lg;
  border-bottom: 1px solid $color-border;
  border-left: 3px solid transparent;
  transition:
    border-color $transition-fast,
    background-color $transition-fast;

  &:hover {
    border-left-color: $color-blue;
    background-color: rgba($color-blue, 0.02);
  }

  &:first-child {
    padding-top: $spacing-lg;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    line-height: $line-height-tight;
    color: $color-black;
    margin-bottom: $spacing-sm;
    max-width: 65ch;
  }

  &__meta {
    display: flex;
    align-items: baseline;
    gap: $spacing-sm;
    margin-bottom: $spacing-sm;
    flex-wrap: wrap;
    font-size: $font-size-sm;
    color: $color-grey;
  }

  &__type {
    font-weight: $font-weight-bold;
    text-transform: uppercase;
    font-size: $font-size-xs;
    letter-spacing: 0.03em;
    color: $color-black;
  }

  &__published {
    font-weight: $font-weight-bold;
    font-size: $font-size-sm;
  }

  &__container {
    font-size: $font-size-sm;

    strong {
      font-weight: $font-weight-semibold;
      color: $color-black;
    }
  }

  &__people {
    font-size: $font-size-sm;
    color: $color-grey;
    margin-bottom: $spacing-xs;
    max-width: 65ch;
    line-height: $line-height-base;
  }

  &__people-label {
    font-weight: $font-weight-medium;
  }

  &__footer {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    flex-wrap: wrap;
    margin-top: $spacing-sm;
  }

  &__doi {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: $font-size-sm;
    color: $color-dark-blue;
    word-break: break-all;
    text-decoration: none;

    &:hover {
      color: $color-blue;
      text-decoration: underline;
    }

    &:active {
      transform: translateY(1px);
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__link-icon {
    flex-shrink: 0;
  }

  &__actions {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: $font-size-sm;
    color: $color-dark-blue;
    background: none;
    border: none;
    cursor: pointer;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-sm;
    transition:
      color $transition-fast,
      background-color $transition-fast;

    &:hover {
      background-color: $color-bg;
      color: $color-blue;
      text-decoration: none;
    }

    &:active {
      transform: translateY(1px);
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__sr-only {
    @include visually-hidden;
  }
}
</style>
