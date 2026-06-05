export function photosBeforeSync({ originalDoc, searchDoc }: { originalDoc: any; searchDoc: any }) {
  searchDoc.title = `Photo ${originalDoc.id}`
  searchDoc.excerpt = (originalDoc.description ?? '').slice(0, 200)
  searchDoc.type = 'PHOTOS'
  // `?open=<id>` tells the photos page to scroll to this record.
  searchDoc.collectionRoute = `photos?open=${originalDoc.id}`
  searchDoc.imageUrl = originalDoc.image?.url ?? ''
  return searchDoc
}
