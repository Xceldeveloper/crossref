import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BasePagination from "@/components/base/BasePagination.vue";

describe("BasePagination", () => {
  it("renders page buttons for given total pages", () => {
    const wrapper = mount(BasePagination, {
      props: { currentPage: 1, totalPages: 5 },
    });
    expect(wrapper.text()).toContain("1");
    expect(wrapper.text()).toContain("5");
  });

  it("disables the previous button on first page", () => {
    const wrapper = mount(BasePagination, {
      props: { currentPage: 1, totalPages: 5 },
    });
    const prevButton = wrapper.find('[aria-label="Go to previous page"]');
    expect(prevButton.attributes("disabled")).toBeDefined();
  });

  it("disables the next button on last page", () => {
    const wrapper = mount(BasePagination, {
      props: { currentPage: 5, totalPages: 5 },
    });
    const nextButton = wrapper.find('[aria-label="Go to next page"]');
    expect(nextButton.attributes("disabled")).toBeDefined();
  });

  it("emits page-change when a page button is clicked", async () => {
    const wrapper = mount(BasePagination, {
      props: { currentPage: 1, totalPages: 5 },
    });
    const page2 = wrapper.find('[aria-label="Go to page 2"]');
    await page2.trigger("click");
    expect(wrapper.emitted("page-change")).toEqual([[2]]);
  });

  it("marks the active page with aria-current", () => {
    const wrapper = mount(BasePagination, {
      props: { currentPage: 3, totalPages: 5 },
    });
    const activePage = wrapper.find('[aria-current="page"]');
    expect(activePage.text()).toBe("3");
  });
});
