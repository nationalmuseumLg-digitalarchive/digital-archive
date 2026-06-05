export function manuscriptsBeforeSync({
  originalDoc,
  searchDoc,
}: {
  originalDoc: any
  searchDoc: any
}) {
  searchDoc.title = originalDoc.internalName ?? `Manuscript ${originalDoc.id}`
  searchDoc.excerpt = ''
  searchDoc.type = 'MANUSCRIPTS'
  searchDoc.collectionRoute = originalDoc.nav?.[0]?.link ?? 'manuscripts'
  return searchDoc
}
