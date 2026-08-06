import {createClient} from '@sanity/client'

export const DEFAULT_AUTHOR = 'Thaqib ibn Fazle'

export type Taxonomy = {
  title: string
  slug: string
}

export type ContentItem = {
  _id: string
  type: 'article' | 'pdf'
  title: string
  slug: string
  summary: string
  date: string
  category: Taxonomy | null
  tags: Taxonomy[]
  href: string
  readTime?: number
  pageCount?: number
  author: string
  content?: string
  fileUrl?: string
  tagSlugs: string[]
  imageUrl?: string
}

export type SocialLink = {
  platform: 'instagram' | 'youtube' | 'discord' | string
  url: string
}

export type SiteSettings = {
  tagline: string
  socialLinks: SocialLink[]
}

export type ClusterSection = {
  _key: string
  heading: string
  items: ContentItem[]
}

export type CategoryPage = Taxonomy & {
  heading?: string
  subheading?: string
  sections: ClusterSection[]
}

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset = import.meta.env.PUBLIC_SANITY_DATASET
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || '2026-08-01'

export const sanity = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

const categoryProjection = `{
  title,
  "slug": slug.current
}`

const tagProjection = `{
  title,
  "slug": slug.current
}`

function imageUrl(url?: string, width = 800) {
  if (!url) return undefined
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}w=${width}&h=${Math.round((width * 9) / 16)}&fit=crop&auto=format`
}

function readTime(markdown: string): number {
  const words = markdown
    .replace(/[#*\`\[\]()_]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function mapArticle(doc: any): ContentItem {
  const categorySlug = doc.category?.slug
  return {
    _id: doc._id,
    type: 'article',
    title: doc.title,
    slug: doc.slug,
    summary: doc.summary,
    date: doc.date,
    category: doc.category ?? null,
    tags: doc.tags ?? [],
    href: categorySlug ? `/${categorySlug}/${doc.slug}` : `/`,
    readTime: readTime(doc.content || ''),
    author: DEFAULT_AUTHOR,
    content: doc.content,
    tagSlugs: (doc.tags ?? []).map((t: Taxonomy) => t.slug),
    imageUrl: imageUrl(doc.imageUrl, 960),
  }
}

function mapPdf(doc: any): ContentItem {
  const categorySlug = doc.category?.slug
  return {
    _id: doc._id,
    type: 'pdf',
    title: doc.title,
    slug: doc.slug,
    summary: doc.summary,
    date: doc.date,
    category: doc.category ?? null,
    tags: doc.tags ?? [],
    href: categorySlug ? `/${categorySlug}/${doc.slug}` : `/`,
    pageCount: doc.pageCount ?? undefined,
    author: DEFAULT_AUTHOR,
    fileUrl: doc.fileUrl || undefined,
    tagSlugs: (doc.tags ?? []).map((t: Taxonomy) => t.slug),
    imageUrl: imageUrl(doc.imageUrl, 960),
  }
}

function byDateDesc(a: ContentItem, b: ContentItem) {
  return b.date.localeCompare(a.date)
}

const articleFields = `
  _id,
  title,
  "slug": slug.current,
  summary,
  date,
  content,
  "imageUrl": thumbnail.asset->url,
  category->${categoryProjection},
  "tags": tags[]->${tagProjection}
`

const pdfFields = `
  _id,
  title,
  "slug": slug.current,
  summary,
  date,
  pageCount,
  "fileUrl": file.asset->url,
  "imageUrl": thumbnail.asset->url,
  category->${categoryProjection},
  "tags": tags[]->${tagProjection}
`

const contentRefFields = `
  _type,
  _id,
  title,
  "slug": slug.current,
  summary,
  date,
  content,
  pageCount,
  "fileUrl": file.asset->url,
  "imageUrl": thumbnail.asset->url,
  category->${categoryProjection},
  "tags": tags[]->${tagProjection}
`

export async function getArticles(): Promise<ContentItem[]> {
  const docs = await sanity.fetch(
    `*[_type == "article" && defined(slug.current)] | order(date desc) {${articleFields}}`,
  )
  return (docs || []).map(mapArticle)
}

export async function getPdfs(): Promise<ContentItem[]> {
  const docs = await sanity.fetch(
    `*[_type == "pdf" && defined(slug.current)] | order(date desc) {${pdfFields}}`,
  )
  return (docs || []).map(mapPdf)
}

export async function getAllContent(): Promise<ContentItem[]> {
  const [articles, pdfs] = await Promise.all([getArticles(), getPdfs()])
  return [...articles, ...pdfs].sort(byDateDesc)
}

export async function getCategories(): Promise<Taxonomy[]> {
  return (
    (await sanity.fetch(`*[_type == "category" && defined(slug.current)] | order(title asc) {
      title,
      "slug": slug.current
    }`)) || []
  )
}

export async function getCategoryPages(): Promise<CategoryPage[]> {
  const docs = await sanity.fetch(`*[_type == "category" && defined(slug.current)] | order(title asc) {
    title,
    "slug": slug.current,
    heading,
    subheading,
    sections[]{
      _key,
      heading,
      "rawItems": items[]->{${contentRefFields}}
    },
    "legacyCurated": curatedItems[]->{${contentRefFields}}
  }`)

  return (docs || []).map((doc: any) => {
    let sections: ClusterSection[] = (doc.sections || [])
      .filter((section: any) => section?.heading)
      .map((section: any) => ({
        _key: section._key,
        heading: section.heading,
        items: (section.rawItems || [])
          .filter(Boolean)
          .map((item: any) => (item._type === 'pdf' ? mapPdf(item) : mapArticle(item))),
      }))

    // Backward-compatible fallback while curatedItems is migrated to sections.
    if (sections.length === 0 && Array.isArray(doc.legacyCurated) && doc.legacyCurated.length > 0) {
      sections = [
        {
          _key: 'legacy-curated',
          heading: 'Featured',
          items: doc.legacyCurated
            .filter(Boolean)
            .map((item: any) => (item._type === 'pdf' ? mapPdf(item) : mapArticle(item))),
        },
      ]
    }

    return {
      title: doc.title,
      slug: doc.slug,
      heading: doc.heading || undefined,
      subheading: doc.subheading || undefined,
      sections,
    }
  })
}

/** Map of content id → section keys that include it (across all categories). */
export async function getSectionMembership(): Promise<Map<string, string[]>> {
  const pages = await getCategoryPages()
  const map = new Map<string, string[]>()
  for (const page of pages) {
    for (const section of page.sections) {
      for (const item of section.items) {
        const existing = map.get(item._id) || []
        existing.push(section._key)
        map.set(item._id, existing)
      }
    }
  }
  return map
}

export async function getContentByPath(category: string, slug: string): Promise<ContentItem | null> {
  const doc = await sanity.fetch(
    `*[(_type == "article" || _type == "pdf") && slug.current == $slug && category->slug.current == $category][0]{
      _type,
      _id,
      title,
      "slug": slug.current,
      summary,
      date,
      content,
      pageCount,
      "fileUrl": file.asset->url,
      "imageUrl": thumbnail.asset->url,
      category->${categoryProjection},
      "tags": tags[]->${tagProjection}
    }`,
    {category, slug},
  )
  if (!doc) return null
  return doc._type === 'pdf' ? mapPdf(doc) : mapArticle(doc)
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const doc = await sanity.fetch(`*[_id == "siteSettings"][0]{
    tagline,
    socialLinks[]{platform, url}
  }`)

  const allowed = new Set(['instagram', 'youtube', 'discord'])

  return {
    tagline:
      doc?.tagline || 'A digital library of clear, referenced articles clarifying Islam.',
    socialLinks: (doc?.socialLinks || []).filter(
      (l: SocialLink) => l?.platform && l?.url && allowed.has(l.platform),
    ),
  }
}

/**
 * Related content: same category → same cluster section → newest remaining.
 */
export function getRelated(
  item: ContentItem,
  catalog: ContentItem[],
  sectionMembership: Map<string, string[]>,
  limit = 3,
): ContentItem[] {
  const others = catalog.filter((c) => c._id !== item._id)
  const categorySlug = item.category?.slug
  const itemSections = new Set(sectionMembership.get(item._id) || [])

  const scored = others.map((c) => {
    let score = 0
    if (categorySlug && c.category?.slug === categorySlug) score += 4
    const otherSections = sectionMembership.get(c._id) || []
    if (otherSections.some((id) => itemSections.has(id))) score += 2
    return {c, score}
  })

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return b.c.date.localeCompare(a.c.date)
  })

  return scored.slice(0, limit).map((s) => s.c)
}
