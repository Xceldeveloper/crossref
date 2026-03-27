<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import IconSearch from "@/components/icons/IconSearch.vue";

const router = useRouter();
const query = ref("");

function onSubmit() {
  const q = query.value.trim();
  if (!q) return;
  router.push({ name: "search-works", query: { q } });
}
</script>

<template>
  <div class="home-page">
    <header class="home-page__header">
      <img
        src="https://assets.crossref.org/logo/crossref-logo-landscape-200.svg"
        alt="Crossref"
        width="200"
        height="68"
        class="home-page__header-logo"
      />
    </header>
    <div class="home-page__body">
      <div class="home-page__hero">
        <p class="home-page__tagline">
          Search the metadata <br />
          of journal articles, books, standards, datasets &amp; more
        </p>
        <form
          class="home-page__search"
          role="search"
          @submit.prevent="onSubmit"
        >
          <div class="home-page__input-wrapper">
            <IconSearch class="home-page__search-icon" />
            <input
              v-model="query"
              type="search"
              class="home-page__input"
              placeholder="Title, author, DOI, ORCID iD, etc."
              aria-label="Search Crossref metadata"
            />
          </div>
        </form>
        <a
          href="https://search.crossref.org/help/works"
          class="home-page__help-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Search help
          <span class="home-page__sr-only">(opens in new tab)</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;

  &__header {
    padding: $spacing-md $spacing-lg;
  }

  &__header-logo {
    height: 2.5rem;
    width: auto;
  }

  &__body {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 $spacing-md;
    margin-top: -5rem;
  }

  &__hero {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-md;
    max-width: 40rem;
    width: 100%;
  }

  &__tagline {
    font-size: $font-size-xl;
    font-weight: $font-weight-regular;
    line-height: $line-height-base;
    color: $color-grey;

    @include respond-to($breakpoint-md) {
      font-size: $font-size-2xl;
    }
  }

  &__search {
    width: 100%;
  }

  &__input-wrapper {
    position: relative;
    width: 100%;
  }

  &__search-icon {
    position: absolute;
    left: $spacing-md;
    top: 50%;
    transform: translateY(-50%);
    color: $color-grey;
    pointer-events: none;
  }

  &__input {
    width: 100%;
    padding: $spacing-md $spacing-md $spacing-md 3rem;
    font-family: $font-family-base;
    font-size: $font-size-base;
    color: $color-black;
    background-color: $color-white;
    border: 2px solid $color-border;
    border-radius: $radius-md;
    transition:
      border-color $transition-fast,
      box-shadow $transition-fast;

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

  &__help-link {
    font-size: $font-size-sm;
    color: $color-dark-blue;
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

  &__sr-only {
    @include visually-hidden;
  }
}
</style>
