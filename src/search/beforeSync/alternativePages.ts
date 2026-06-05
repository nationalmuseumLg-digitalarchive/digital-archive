export function alternativePagesBeforeSync({
  originalDoc,
  searchDoc,
}: {
  originalDoc: any
  searchDoc: any
}) {
  const blocks: any[] = originalDoc?.pageSection?.layout ?? []

  const names = blocks
    .map((b) => b.objectName ?? b.NAHA ?? b.objectType ?? '')
    .filter(Boolean)
    .join(' ')
  const keywords = blocks.map((b) => b.keyword ?? '').filter(Boolean).join(' ')
  const descriptions = blocks.map((b) => b.description ?? '').filter(Boolean).join(' ')

  searchDoc.title = [originalDoc.internalName, names, keywords].filter(Boolean).join(' ') || 'Untitled'
  searchDoc.excerpt = descriptions.slice(0, 200)
  searchDoc.type = 'ALT PAGES'
  searchDoc.imageUrl = blocks.find((b) => b.image?.url)?.image?.url ?? ''

  const section = originalDoc.section ?? 'alternative_heritages_objects'
  searchDoc.collectionRoute = `${section}/${originalDoc.slug ?? ''}`

  return searchDoc
}
