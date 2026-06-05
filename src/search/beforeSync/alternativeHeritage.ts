export function alternativeHeritageBeforeSync({
  originalDoc,
  searchDoc,
}: {
  originalDoc: any
  searchDoc: any
}) {
  searchDoc.title = originalDoc.internalName ?? `Alternative Heritage ${originalDoc.id}`
  searchDoc.excerpt = ''
  searchDoc.type = 'ALT HERITAGE'
  searchDoc.collectionRoute = originalDoc.nav?.[0]?.link ?? 'alternative_heritages_objects'
  return searchDoc
}
