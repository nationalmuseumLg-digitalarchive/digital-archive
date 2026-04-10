import React from 'react'
import config from '@payload-config'
import Image from 'next/legacy/image'
import Nav from '@/components/Nav'
import Link from 'next/link'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

const getCachedHeaderData = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const [
      header,
      intelligence_reports,
      manuscripts,
      maps,
      government_reports,
      alternative_archival_heritages,
      alternative_heritages,
    ] = await Promise.all([
      payload.findGlobal({
        slug: 'header',
        select: {
          nav: true,
          logo: true,
        },
      }),
      payload.find({
        collection: 'intelligence_reports',
        draft: false,
        limit: 100,
        select: {
          nav: true,
        },
      }),
      payload.find({
        collection: 'manuscripts',
        draft: false,
        limit: 100,
        select: {
          nav: true,
        },
      }),
      payload.find({
        collection: 'maps',
        draft: false,
        limit: 100,
        select: {
          nav: true,
        },
      }),
      payload.find({
        collection: 'government_reports',
        draft: false,
        limit: 100,
        select: {
          nav: true,
        },
      }),
      payload.find({
        collection: 'alternative_archival_heritages',
        draft: false,
        limit: 100,
        select: {
          nav: true,
        },
      }),
      payload.find({
        collection: 'alternative_heritages',
        draft: false,
        limit: 100,
        select: {
          nav: true,
        },
      }),
    ])

    return {
      header,
      intelligence_reports,
      manuscripts,
      maps,
      government_reports,
      alternative_archival_heritages,
      alternative_heritages,
    }
  },
  ['header-navigation-data'],
  { revalidate: 300, tags: ['header', 'navigation'] },
)

const HeaderServer = async () => {
  const {
    header,
    intelligence_reports,
    manuscripts,
    maps,
    government_reports,
    alternative_archival_heritages,
    alternative_heritages,
  } = await getCachedHeaderData()

  const navItems = header?.nav || []

  return (
    <div className="flex relative items-center justify-center w-[100%]  h-fit py-4 border-b-[1px] border-primary px-8 z-20">
      <div className="w-fit h-fit ">
        <Link
          href={'/'}
          className="justify-self-start"
          style={{
            paddingLeft: '1rem',
            bottom: '4px',
          }}
        >
          <Image
            width={35}
            height={40}
            src={header.logo.url}
            alt="logo"
            className="aspect-square"
          />
        </Link>
      </div>

      <Nav
        className=""
        pages={navItems}
        alternative_heritages={alternative_heritages}
        alternative_archival_heritages={alternative_archival_heritages}
        intelligence_reports={intelligence_reports}
        manuscripts={manuscripts}
        maps={maps}
        government_reports={government_reports}
      />
    </div>
  )
}

export default HeaderServer
