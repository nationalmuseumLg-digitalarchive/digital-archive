import assert from 'node:assert/strict'
import test from 'node:test'

import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

test('the archive error boundary does not mislabel every failure as a database cold start', async () => {
  globalThis.React = React
  const { default: ArchiveError } = await import('../src/app/(app)/error.jsx')
  const markup = renderToStaticMarkup(
    React.createElement(ArchiveError, {
      error: new Error('render failed'),
      reset() {},
    }),
  )

  assert.match(markup, /Loading archive data/)
  assert.doesNotMatch(markup, /Waking the database/)
})
