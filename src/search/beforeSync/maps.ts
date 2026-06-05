export function mapsBeforeSync({ originalDoc, searchDoc }: { originalDoc: any; searchDoc: any }) {
  searchDoc.title = `Map ${originalDoc.id}`
  searchDoc.excerpt = (originalDoc.description ?? '').slice(0, 200)
  searchDoc.type = 'MAPS'
  // `?open=<id>` tells the maps page to land on the right pagination page and
  // scroll to this record.
  searchDoc.collectionRoute = `maps?open=${originalDoc.id}`
  searchDoc.imageUrl = originalDoc.image?.url ?? ''
  return searchDoc
}
