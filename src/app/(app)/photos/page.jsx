// 'use client'

import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import React from 'react'
import Image from "next/legacy/image"

import Pagination from '@/components/Pagination'
import ScrollToId from '@/components/ScrollToId'

const Photos = async ({ searchParams }) => {
  const { page: pageParam, open: openParam } = await searchParams
  const limit = 12

  const payloadForPage = await getPayload({ config })

  // Deep-link from search (?open=<id>): find the page holding the record.
  let currentPage = parseInt(pageParam) || 1
  if (openParam && !pageParam) {
    const all = await payloadForPage.find({
      collection: 'photos',
      depth: 0,
      limit: 10000,
      select: {},
    })
    const idx = all.docs.findIndex((d) => String(d.id) === String(openParam))
    if (idx >= 0) currentPage = Math.floor(idx / limit) + 1
  }


  const pages = await payloadForPage.find({
    collection: 'photos',
    draft: false,
    limit,
    page: currentPage,
    select: {
      image: true,
      description: true,
    },
  })

  return (
    <>
      <ScrollToId targetId={openParam} />
      <div className="w-[100%] min-h-[100vh] h-[100%] font-montserrat flex justify-start bg-background border-black border-t-[1px] p-8 overflow-hidden">
        <div className="h-fit w-full text-primary flex flex-col gap-4 text-[0.75rem] sm:text-[1rem] px-2 sm:px-8">
          <h2 className="text-[2rem] sm:text-[3rem] uppercase font-bold pb-2">Photo gallery</h2>

          <div
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            }}
            className="p-4 grid  w-[100%] h-fit justify-center gap-8  items-center"
          >
            {pages.docs.map((page, i) => {
              return (
                <div
                  key={page.id}
                  id={page.id}
                  className="flex flex-col justify-start items-start gap-3 w-full h-auto"
                >
                  <div className="relative aspect-[4/3] w-full bg-backgroundDark rounded-md overflow-hidden">
                    <Image
                      layout="fill"
                      alt={page.image.alt}
                      loading="lazy"
                      width={500}
                      height={500}
                      src={page.image.url}
                      className="object-center object-contain"
                    />
                  </div>

                  <p className="text-[0.85rem] leading-relaxed text-slate-700">{page.description}</p>
                </div>
              )
            })}
          </div>

          <Pagination totalPages={pages.totalPages} currentPage={pages.page} />
        </div>

      </div>
    </>
  )
}

export default Photos