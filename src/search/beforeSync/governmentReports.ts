export function governmentReportsBeforeSync({
  originalDoc,
  searchDoc,
}: {
  originalDoc: any
  searchDoc: any
}) {
  searchDoc.title = originalDoc.internalName ?? `Government Report ${originalDoc.id}`
  searchDoc.excerpt = ''
  searchDoc.type = 'GOVT REPORTS'
  searchDoc.collectionRoute = originalDoc.nav?.[0]?.link ?? 'government_reports'
  return searchDoc
}
