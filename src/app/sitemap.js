const BASE = 'https://lagosmuseumarchives.ng'

// Top-level sections. The homepage is listed first at priority 1 so search
// engines treat it as the site's entry point rather than picking an interior
// page (such as /about) as the primary result.
const routes = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/intelligence_reports', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/manuscripts', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/maps', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/photos', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/government_reports', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/alternative_heritage_archival', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/alternative_heritages_objects', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/ethnography_and_archaeology', priority: 0.8, changeFrequency: 'monthly' },
]

export default function sitemap() {
  const lastModified = new Date()

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
