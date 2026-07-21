import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'





import Image from "next/legacy/image"
import Pagination from '@/components/Pagination'

const AlternativeHeritage = async ({ searchParams }) => {
  const { page: pageParam } = await searchParams
  const currentPage = parseInt(pageParam) || 1
  const limit = 20

  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'alternative_archival_heritages',
    draft: false,
    limit,
    page: currentPage,
    select: {
      nav: true,
    },
  })


  return (
    <>
      <div className="w-[100vw] min-h-[100vh] h-[100%] font-montserrat flex justify-between bg-background border-black border-t-[1px] flex-row p-8 ">
        <div className="flex justify-between flex-col">
          <div className="h-fit w-fit flex flex-col gap-4 text-[0.75rem] sm:text-[1rem]">
            <h2 className="text-[2rem] sm:text-[3rem] font-bold pb-2 text-primary">
              NIERIAN ALTERNATIVE ARCHIVAL HERITAGES
            </h2>

            <div className="w-fit h-fit">
              <Image
                style={{ objectFit: 'contain' }}
                className="object-contain"
                width={300}
                height={200}
                src="/assets/alternative2.webp"
                alt="maps"
              />
            </div>

            <div className="pb-8 flex flex-col gap-3">
              <h2 className="font-bold text-[0.65rem] tracking-[0.2em] text-black/40 uppercase pb-1">SECTIONS</h2>
              <div className="flex flex-col gap-3">
                {pages.docs.map((page, i) => {
                  return (
                    <Link
                      key={i}
                      className="group flex items-center justify-between sm:min-w-[360px] px-5 py-4 bg-primary text-background uppercase font-bold text-xs sm:text-sm tracking-widest hover:bg-primary-light active:opacity-80 transition-all duration-200"
                      href={`/${page.nav[0].link}`}
                    >
                      <span>{page.nav[0].label}</span>
                      <span className="ml-6 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">→</span>
                    </Link>
                  )
                })}
              </div>

              <Pagination totalPages={pages.totalPages} currentPage={pages.page} />
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default AlternativeHeritage