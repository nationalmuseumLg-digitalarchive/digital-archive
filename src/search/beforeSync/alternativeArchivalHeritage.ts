export function alternativeArchivalHeritageBeforeSync({
  originalDoc,
  searchDoc,
}: {
  originalDoc: any
  searchDoc: any
}) {
  searchDoc.title = originalDoc.internalName ?? `Archival Heritage ${originalDoc.id}`
  searchDoc.excerpt = ''
  searchDoc.type = 'ARCHIVAL HERITAGE'
  searchDoc.collectionRoute = originalDoc.nav?.[0]?.link ?? 'alternative_heritage_archival'
  return searchDoc
}
