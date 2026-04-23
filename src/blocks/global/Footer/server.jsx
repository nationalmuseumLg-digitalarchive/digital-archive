import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/legacy/image'
import { unstable_cache } from 'next/cache'

const getCachedFooterData = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const [footer, header] = await Promise.all([
      payload.findGlobal({
        slug: 'footer',
      }),
      payload.findGlobal({
        slug: 'header',
        select: {
          nav: true,
        },
      }),
    ])

    return { footer, header }
  },
  ['footer-data'],
  { revalidate: 3600, tags: ['footer', 'navigation'] },
)

const FooterServer = async () => {
  const { footer, header } = await getCachedFooterData()
  const footerLogoUrl = footer?.logo?.url

  return (
    <>
      <div className="w-[100vw] font-montserrat h-fit grid grid-cols-1 sm:grid-cols-3 bg-primary border-black border-t-[1px] pt-8 gap-4 p-8">
        <div className="flex justify-between flex-col gap-4 w-fit h-fit">
          <div className="h-fit w-fit text-background flex flex-col gap-4 z-10 text-[0.75rem] uppercase">
            <h2 className="text-[1rem] text-background font-bold">Quick Links</h2>
            {header.nav.map((link, i) => {
              return (
                <Link key={i} className="hover:border-b-2 border-background" href={`/${link.link}`}>
                  {' '}
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex h-[100%] w-[100%]  gap-4 flex-col text-background">
          <p className="text-background break-words font-light mt-4 text-[0.75rem]">
            Copyright 2024 @ National Museum Lagos, <br />
            All the works published in this archive are licensed under <br />
            Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
            {/* {footer["copyrightNot ice"]} */}
          </p>

          <div>
            <p className="text-[0.75rem] sm:p-4">
              {' '}
              This project is funded by the French Embassy in Nigeria through IFRA-NIGERIA FSPI
              PROJECT
            </p>
          </div>

          <div className="flex gap-4">
            <Image
              src="/assets/ifra.png"
              alt="logo"
              width={100}
              height={100}
              className=" sm:p-4 object-contain h-fit"
            />

            <Image
              src="/assets/ifra2.png"
              alt="logo"
              width={100}
              height={100}
              className=" sm:p-4 object-contain h-fit"
            />

            <Image
              src="/assets/CNRS.png"
              alt="logo"
              width={100}
              height={100}
              className=" sm:p-4 pt-4 object-contain h-fit"
            />
          </div>

          <Link href="https://uzoma.studio/" target="_blank">
            <p className="text-background  font-light mt-4 text-[0.75rem]">
              Designed and developed by Uzoma Studio
            </p>
          </Link>
        </div>

        <div className="flex h-[100%] justify-start sm:h-[100%] w-fit gap-4 flex-col text-background">
          <div className="items-center  h-fit flex">
            {footerLogoUrl && (
              <Image
                src={footerLogoUrl}
                alt="logo"
                width={50}
                height={50}
                className=" sm:p-4 object-contain h-fit"
              />
            )}

            <Link href="/" className="text-background  h-fit font-bold">
              NATIONAL MUSEUM LAGOS
            </Link>
          </div>

          <p className="text-[0.75rem] gap-2 flex items-center sm:p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path d="M480-301q99-80 149.5-154T680-594q0-90-56-148t-144-58q-88 0-144 58t-56 148q0 65 50.5 139T480-301Zm0 101Q339-304 269.5-402T200-594q0-125 78-205.5T480-880q124 0 202 80.5T760-594q0 94-69.5 192T480-200Zm0-320q33 0 56.5-23.5T560-600q0-33-23.5-56.5T480-680q-33 0-56.5 23.5T400-600q0 33 23.5 56.5T480-520ZM200-80v-80h560v80H200Zm280-520Z" />
            </svg>
            King George V. Road, Onikan, P.M.B. 12556, Lagos State.
          </p>

          <Link href="https://www.facebook.com/NationalMuseumOnikanLagos" target="_blank">
            <div className="text-[0.75rem] gap-2 flex items-center sm:p-4">
              <Image src={'/assets/Facebook icons.png'} alt="facebook logo" width={30} height={30} />
              National Museum Onikan Lagos
            </div>
          </Link>

          <Link href="https://www.instagram.com/nationalmuseum_lagos" target="_blank">
            <p className="text-[0.75rem] gap-2 items-center flex sm:p-4">
              <Image src={'/assets/Instagram icon.png'} alt="instagram logo" width={30} height={30} />
              nationalmuseum_lagos
            </p>
          </Link>
        </div>
      </div>
    </>
  )
}

export default FooterServer