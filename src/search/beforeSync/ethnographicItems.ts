export function ethnographicItemsBeforeSync({
  originalDoc,
  searchDoc,
}: {
  originalDoc: any
  searchDoc: any
}) {
  searchDoc.title = originalDoc.objectName ?? `Ethnographic Item ${originalDoc.id}`
  searchDoc.excerpt = (originalDoc.description ?? originalDoc.provenance ?? '').slice(0, 200)
  searchDoc.type = 'ETHNOGRAPHIC'
  // Ethnographic items are rendered on the alternativePages "ethnographic_objects"
  // page (it special-cases that slug and loads the whole collection). `?open=<id>`
  // tells that page to jump to and expand this item's card.
  searchDoc.collectionRoute = `alternative_heritages_objects/ethnographic_objects?open=${originalDoc.id}`
  searchDoc.imageUrl = originalDoc.image?.url ?? ''
  return searchDoc
}
