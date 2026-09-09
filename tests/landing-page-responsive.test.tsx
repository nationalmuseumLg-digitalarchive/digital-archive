import assert from 'node:assert/strict'
import test from 'node:test'

import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

test('the archive hero can grow taller than the viewport when its cards need space', async () => {
  globalThis.React = React
  const { default: LandingPage } = await import('../src/components/LandingPage.jsx')
  const markup = renderToStaticMarkup(React.createElement(LandingPage))
  const sectionClass = markup.match(/<section class="([^"]+)"/)?.[1] ?? ''

  assert.ok(
    sectionClass.includes('min-h-[80svh]'),
    'the hero should preserve its visual minimum without forcing a fixed height',
  )
  assert.ok(
    !sectionClass.includes('h-[80vh]'),
    'a fixed viewport height makes card copy overlap the following section on short screens',
  )
})
