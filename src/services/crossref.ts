import { http } from "./http";
import type { CrossrefResponse, SortField } from "@/types/crossref";

export async function searchWorks(
  query: string,
  facets: string,
  filter: string,
  rows: number,
  offset: number,
  sort: SortField = "relevance",
): Promise<CrossrefResponse> {
  const params: Record<string, string> = {
    "query.bibliographic": query,
    facet: facets,
    rows: String(rows),
    offset: String(offset),
    sort: sort === "relevance" ? "score" : sort,
    order: "desc",
  };

  if (filter) params.filter = filter;

  return http<CrossrefResponse>("/works", params);
}
