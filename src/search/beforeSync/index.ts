import { pagesBeforeSync } from './pages'
import { alternativePagesBeforeSync } from './alternativePages'
import { ethnographicItemsBeforeSync } from './ethnographicItems'
import { mapsBeforeSync } from './maps'
import { manuscriptsBeforeSync } from './manuscripts'
import { intelligenceReportsBeforeSync } from './intelligenceReports'
import { governmentReportsBeforeSync } from './governmentReports'
import { photosBeforeSync } from './photos'
import { alternativeHeritageBeforeSync } from './alternativeHeritage'
import { alternativeArchivalHeritageBeforeSync } from './alternativeArchivalHeritage'

export function globalBeforeSync({
  originalDoc,
  searchDoc,
}: {
  originalDoc: any
  searchDoc: any
}) {
  const collectionSlug = (searchDoc.doc as any)?.relationTo as string | undefined

  switch (collectionSlug) {
    case 'pages':
      return pagesBeforeSync({ originalDoc, searchDoc })
    case 'alternativePages':
      return alternativePagesBeforeSync({ originalDoc, searchDoc })
    case 'ethnographicItems':
      return ethnographicItemsBeforeSync({ originalDoc, searchDoc })
    case 'maps':
      return mapsBeforeSync({ originalDoc, searchDoc })
    case 'manuscripts':
      return manuscriptsBeforeSync({ originalDoc, searchDoc })
    case 'intelligence_reports':
      return intelligenceReportsBeforeSync({ originalDoc, searchDoc })
    case 'government_reports':
      return governmentReportsBeforeSync({ originalDoc, searchDoc })
    case 'photos':
      return photosBeforeSync({ originalDoc, searchDoc })
    case 'alternative_heritages':
      return alternativeHeritageBeforeSync({ originalDoc, searchDoc })
    case 'alternative_archival_heritages':
      return alternativeArchivalHeritageBeforeSync({ originalDoc, searchDoc })
    default:
      return searchDoc
  }
}
