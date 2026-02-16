import { liteClient as algoliasearch } from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import { searchBox, hits, configure } from 'instantsearch.js/es/widgets';
import { getPropertyByPath } from 'instantsearch.js/es/lib/utils';

// Connect and authenticate with your Algolia app
const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY);

const search = instantsearch({
    indexName: 'movies_index',
    searchClient,
  });
  
  search.addWidgets([
    searchBox({
      container: "#searchbox"
    }),
    configure({
      hitsPerPage: 5
    }),
    hits({
      container: "#hits",
      templates: {
        item: (hit, { html, components }) => html`
          <div>
            <img src="${hit.backdrop_path}" />
                      <div class="hit-original_title">
                        ${components.Highlight({ hit, attribute: "original_title" })}
                      </div>
          </div>
        `,
      },
    }),
  ]);
  
  export default search;