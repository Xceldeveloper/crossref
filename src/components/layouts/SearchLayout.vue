<script setup lang="ts">
defineProps<{
  hasSidebar?: boolean;
}>();

const navLinks = [
  { label: 'Metadata Search', href: 'https://search.crossref.org/' },
  { label: 'Funding Data', href: 'https://search.crossref.org/search/funders' },
  { label: 'Link References', href: 'https://search.crossref.org/search/references' },
  { label: 'Status', href: 'https://status.crossref.org/' },
  { label: 'API', href: 'https://api.crossref.org/' },
  { label: 'Help', href: 'https://search.crossref.org/help/works' },
]
</script>

<template>
  <div class="search-layout">
    <header class="search-layout__header">
      <div class="search-layout__top-bar">
        <RouterLink
          to="/"
          class="search-layout__logo"
          aria-label="Crossref Metadata Search home"
        >
          <img
            src="https://assets.crossref.org/logo/crossref-logo-landscape-200.svg"
            alt="Crossref"
            width="200"
            height="68"
            class="search-layout__logo-img"
          >
        </RouterLink>
        <nav
          class="search-layout__nav"
          aria-label="Main navigation"
        >
          <a
            v-for="link in navLinks"
            :key="link.label"
            :href="link.href"
            class="search-layout__nav-link"
          >
            {{ link.label }}
          </a>
        </nav>
      </div>
      <div class="search-layout__search-row">
        <div class="search-layout__search">
          <slot name="header" />
        </div>
      </div>
    </header>
    <div
      class="search-layout__body"
      :class="{ 'search-layout__body--no-sidebar': !hasSidebar }"
    >
      <slot name="sidebar" />
      <main class="search-layout__content">
        <slot name="content" />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-layout {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;

  &__header {
    background-color: $color-white;
    position: sticky;
    top: 0;
    z-index: $z-sidebar;
  }

  &__top-bar {
    max-width: $breakpoint-xl;
    margin: 0 auto;
    padding: $spacing-md $spacing-lg;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-md;
    flex-wrap: wrap;
  }

  &__logo {
    display: inline-flex;
    text-decoration: none;
    flex-shrink: 0;
  }

  &__logo-img {
    height: 2.25rem;
    width: auto;
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    flex-wrap: wrap;
  }

  &__nav-link {
    font-size: $font-size-xs;
    color: $color-grey;
    text-decoration: none;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-sm;
    transition: color $transition-fast, background-color $transition-fast;
    white-space: nowrap;

    &:hover {
      color: $color-dark-blue;
      background-color: $color-bg;
    }

    &:active {
      transform: translateY(1px);
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__search-row {
    max-width: $breakpoint-xl;
    margin: 0 auto;
    padding: $spacing-sm $spacing-lg $spacing-lg;
  }

  &__search {
    max-width: 36rem;
  }

  &__body {
    display: grid;
    grid-template-columns: 1fr;
    flex: 1;
    max-width: $breakpoint-xl;
    width: 100%;
    margin: 0 auto;
    padding: $spacing-lg $spacing-md;
    gap: $spacing-xl;

    @include respond-to($breakpoint-lg) {
      grid-template-columns: $sidebar-width 1fr;
      padding: $spacing-xl;
    }

    &--no-sidebar {
      @include respond-to($breakpoint-lg) {
        grid-template-columns: 1fr;
      }
    }
  }

  &__content {
    min-width: 0;
  }
}
</style>
