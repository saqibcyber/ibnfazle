export const PAGE_SIZE = 12

export type PageResult<T> = {
  items: T[]
  page: number
  totalPages: number
  total: number
  hasPrev: boolean
  hasNext: boolean
}

export function totalPagesFor(count: number, pageSize = PAGE_SIZE): number {
  return Math.max(1, Math.ceil(count / pageSize))
}

export function paginate<T>(items: T[], page: number, pageSize = PAGE_SIZE): PageResult<T> {
  const total = items.length
  const totalPages = totalPagesFor(total, pageSize)
  const current = Math.min(Math.max(1, page), totalPages)
  const start = (current - 1) * pageSize

  return {
    items: items.slice(start, start + pageSize),
    page: current,
    totalPages,
    total,
    hasPrev: current > 1,
    hasNext: current < totalPages,
  }
}

/** Homepage listing URL for a 1-based page number. */
export function homePageHref(page: number): string {
  return page <= 1 ? '/' : `/page/${page}`
}

/** Category listing URL for a 1-based page number. */
export function categoryPageHref(categorySlug: string, page: number): string {
  return page <= 1 ? `/${categorySlug}` : `/${categorySlug}/page/${page}`
}
