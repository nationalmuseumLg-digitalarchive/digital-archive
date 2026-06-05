// `pages` documents have no canonical standalone route. They are rendered by
// slug inside several section routes (e.g. /manuscripts/k.c_murray/[slug],
// /intelligence_reports/[slug], /government_reports/[slug]). Those [slug] routes
// query `pages` by slug globally and render only the page title + its card
// blocks — no section-specific chrome — so any of them renders the correct
// record content; only the URL segment differs. The section a page "belongs"
// to is not stored on the document (it lives in hardcoded links across listing
// pages), so we route through one working base. The bulk of pages are K.C.
// Murray ethnographic material, so that is the base. To make routing exact
// per-page, add a `section` select to the Pages collection (mirroring
// AlternativePages) and use `${section}/${slug}` here.
const PAGES_SECTION_BASE = 'manuscripts/k.c_murray'

export function pagesBeforeSync({ originalDoc, searchDoc }: { originalDoc: any; searchDoc: any }) {
  const blocks: any[] = originalDoc?.pageSection?.layout ?? []
  const cardBlocks = blocks.filter((b) => b.blockType === 'file')

  const names = cardBlocks.map((b) => b.title ?? '').filter(Boolean).join(' ')
  const keywords = cardBlocks.map((b) => b.keyword ?? '').filter(Boolean).join(' ')
  const descriptions = cardBlocks.map((b) => b.description ?? '').filter(Boolean).join(' ')

  searchDoc.title = [originalDoc.internalName, names, keywords].filter(Boolean).join(' ') || 'Untitled'
  searchDoc.excerpt = descriptions.slice(0, 200)
  searchDoc.type = 'PAGES'
  searchDoc.imageUrl = cardBlocks.find((b) => b.image?.url)?.image?.url ?? ''

  const slug = originalDoc.slug ?? ''
  searchDoc.collectionRoute = slug ? `${PAGES_SECTION_BASE}/${slug}` : ''

  return searchDoc
}
