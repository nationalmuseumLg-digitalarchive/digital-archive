import React from 'react'
import config from '@payload-config'
import Image from 'next/legacy/image'
import Nav from '@/components/Nav'
import Link from 'next/link'
import { section } from 'framer-motion/client'

import { getPayload } from 'payload'

const HeaderServer = async () => {
  // params.map((d oc) => {
  //   sections.push(doc.internalName)
  // })

  const payload = await getPayload({ config })

  // Parallelize all queries to reduce cumulative latency and prevent timeouts
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

  const navItems = header?.nav || []

  //   const pages = await payload.find({
  //     collection:'pages',
  //     draft: false,
  //     limit: 1000,
  // })

  // console.log(government_reports)

  return (
    // <div>
    // </div>
    <div className="flex relative items-center justify-center w-[100%]  h-fit py-4 border-b-[1px] border-primary px-8 z-20">
      {/* <div className='w-[100%] h-[100%] pl-4'> */}
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
            // layout='fill'
            width={35}
            height={40}
            // sizes="(max-width: 768px) 500px, (max-width: 1200px) 1000px, 33vw"
            src={header.logo.url}
            alt="logo"
            className="aspect-square"
          />
        </Link>
      </div>

      {/* </div> */}
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
      {/* <div className='w-fit flex justify-center items-center right-4 p-4 top-4 h-fit invisible lg:visible'>
         <Search/>
      </div> */}
    </div>
  )
}

export default HeaderServer
