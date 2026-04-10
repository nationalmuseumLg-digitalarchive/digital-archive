import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import * as motion from "framer-motion/client"

import Image from "next/legacy/image"
import Pagination from '@/components/Pagination'


const Government = async ({ searchParams }) => {
  const { page: pageParam } = await searchParams
  const currentPage = parseInt(pageParam) || 1
  const limit = 20

  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'government_reports',
    draft: false,
    limit,
    page: currentPage,
    select: {
      nav: true,
    },
  })

  const anim = {
    initial: {
      width: '100vw',
    },
    open: {
      width: '0',
    },
    closed: {
      width: '100vw',
    },
  }

  return (
    <>
      <div className="w-[100vw] min-h-[100vh] h-[100%] flex justify-between bg-background border-black border-t-[1px] flex-row p-8 ">
        <div className="flex justify-between flex-col">
          <div className="h-fit w-fit flex flex-col gap-4 z-10 text-[0.75rem] sm:text-[1rem]">
            <h2 className="text-[2rem] sm:text-[3rem] font-bold text-primary pb-2 z-1">GOVERNMENT</h2>

            <div className="w-fit h-fit">
              <Image
                className="object-contain"
                width={300}
                height={200}
                src="/assets/Museum.webp"
                alt="maps"
              />
            </div>

            <div className="pb-8 flex flex-col gap-2">
              <h2 className="font-normal text-[1rem]">SECTIONS</h2>
              <div className="flex flex-col gap-2">
                {pages.docs.map((page, i) => {
                  return (
                    <Link
                      key={i}
                      className="border-background uppercase font-semibold text-sm hover:text-[#006600]"
                      href={`/${page.nav[0].link}`}
                    >
                      {' '}
                      {page.nav[0].label}
                    </Link>
                  )
                })}
              </div>

              <Pagination totalPages={pages.totalPages} currentPage={pages.page} />
            </div>
          </div>
        </div>

        <motion.div
          variants={anim}
          initial="initial"
          animate="open"
          exit="closed"
          transition={{
            duration: 0.4,
            ease: 'easeOut',
          }}
          className="w-[100vw] bg-black h-[100vh] left-0 top-0 absolute"
        ></motion.div>
      </div>
    </>
  )
}

export default Government