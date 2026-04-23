/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
// force-dynamic prevents the admin layout from being statically cached,
// which would break cookie-based authentication on Cloudflare Workers.
export const dynamic = 'force-dynamic'

import configPromise from '@payload-config'
import '@payloadcms/next/css'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'


/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import React from 'react'
import config from '@payload-config'
import './custom.scss'
import { importMap } from './admin/importMap'
import type { ServerFunctionClient } from 'payload'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
 'use server'
 return handleServerFunctions({
   ...args,
   config,
   importMap,
 })
}


const Layout = ({ children }: Args) => (
  <RootLayout importMap={importMap} config={configPromise} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
