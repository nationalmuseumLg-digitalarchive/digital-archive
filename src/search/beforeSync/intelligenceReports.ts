export function intelligenceReportsBeforeSync({
  originalDoc,
  searchDoc,
}: {
  originalDoc: any
  searchDoc: any
}) {
  searchDoc.title = originalDoc.internalName ?? `Intelligence Report ${originalDoc.id}`
  searchDoc.excerpt = ''
  searchDoc.type = 'INTELLIGENCE'
  searchDoc.collectionRoute = originalDoc.nav?.[0]?.link ?? 'intelligence_reports'
  return searchDoc
}
