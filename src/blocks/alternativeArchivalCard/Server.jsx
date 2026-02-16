'use client'

import React, { useState } from 'react'
import Image from 'next/legacy/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../utils/useStore'
// import { Document } from 'react-pdf'

const AlternativeArchivalCardBlock = ({
  image,
  description,
  NAHA,
  author,
  file,
  objectType,
  ethnicGroup,
  artist,
  geographicOrigin,
  keyword,
  date,
  rights,
  provenance,
  identifiers,
  id,
}) => {
  const getFileType = (url) => {
    const extension = url?.split('.').pop()?.toLowerCase()

    if (!extension) return 'unknown'

    if (['pdf'].includes(extension)) return 'pdf'
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image'
    if (['mp4', 'webm', 'ogg'].includes(extension)) return 'video'

    return 'other'
  }
  //  const [open, setOpen] = useState(false)
  const openCard = useStore((state) => state.openCard)
  const cardID = useStore((state) => state.cardID)

  const updateOpenCard = useStore((state) => state.updateOpenCard)
  const updateCardId = useStore((state) => state.updateCardId)

  const [loaded, setLoad] = useState(false)

  const handleOpen = (id) => {
    updateOpenCard(!openCard)
    updateCardId(id)

    if (openCard === false) {
      setLoad(false)
    }
  }

  const open = openCard && cardID === id

  return (
    <>
      {/* <div className='w-fit h-fit' id={id}> */}
      <AnimatePresence>
        <div
          id={id}
          className="flex sm:flex-row flex-col justify-between border-black border-[1px]  font-inter transition-all font-light  p-2 gap-4 cursor-pointer bg-background"
          onClick={() => handleOpen(id)}
          style={{
            width: open ? '100vw' : '180px',
            height: open ? 'fit-content' : 'fit-content',
            position: open ? 'absolute' : 'relative',
            zIndex: open ? 100 : 0,
            left: 0,
            top: 0,
            padding: open ? '4rem' : '',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: open ? '30%' : '100%',
            }}
            className="flex flex-col gap-8 w-[100%] min-w-0 h-[100%] justify-between relative "
          >
            <Image
              width={100}
              height={100}
              className="object-contain"
              src={image ? image.url : '/assets/imageSkel.svg'}
              alt="cover page"
            />

            <div className="">
              {/* <h3
                className={`font-semibold uppercase break-words ${open ? 'text-[1rem]' : 'text-[0.8rem]'} pb-4`}
              >
                {title}
              </h3> */}
              <p className={` font-light ${open ? 'text-[1rem]' : 'text-[0.75rem] '}`}>
                {' '}
                {description}
              </p>
            </div>

            <div className="flex justify-between p-4  bottom-2 ">
              <p>{NAHA}</p>

              {/* <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1D1911"><path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z"/></svg> */}
              {open ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#1D1911"
                >
                  <path d="m296-80-56-56 240-240 240 240-56 56-184-184L296-80Zm184-504L240-824l56-56 184 184 184-184 56 56-240 240Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#1D1911"
                >
                  <path d="M480-80 240-320l57-57 183 183 183-183 57 57L480-80ZM298-584l-58-56 240-240 240 240-58 56-182-182-182 182Z" />
                </svg>
              )}
            </div>

            {open ? (
              <motion.div
                id={`${id}`}
                initial={{ opaity: 0, y: 15 }}
                animate={{ opaity: 1, y: 0 }}
                exit={{ opaity: 0, y: 15 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="columns-2 font-bold flex w-[30vw] text-[1rem] flex-col gap-4 bg-background"
              >
                <p className="flex flex-col">
                  Year of Creation/Publication <br />
                  <span className="font-light font-old">{author}</span>
                </p>

                <p className="flex flex-col">
                  Keyword: <br />
                  <span className="font-light font-old">{objectType}</span>
                </p>

                <p className="flex flex-col">
                  Year of Accession: <br />
                  <span className="font-light font-old">{ethnicGroup}</span>
                </p>

                <p className="flex flex-col">
                  Condition: <br />
                  <span className="font-light font-old">{artist}</span>
                </p>

                <p className="flex flex-col">
                  Location: <br />
                  <span className="font-light font-old">{geographicOrigin}</span>
                </p>

                <p className="flex flex-col">
                  Rights: <br />
                  {/* <Link href={rights} prefetch={false} target='_blank' >
                      <span className='font-light  text-blue-500'>
                        {rights}
                      </span> 
                    </Link> */}
                </p>

                <p className="flex flex-col">
                  Provenance: <br />
                  <span className="font-light font-old">{provenance}</span>
                </p>

                <p className="flex flex-col">
                  Date: <br />
                  <span className="font-light font-old">{date}</span>
                </p>

                {/* <p className='flex flex-col'>
                 Identifiers: <br />
                  <span className='font-light font-old'>{identifiers}</span>
                 </p> */}

                <Link
                  className="visible sm:invisible font-bold text-underline"
                  target="_blank"
                  href={file.url}
                  download
                >
                  Download the pdf
                </Link>
              </motion.div>
            ) : (
              <></>
            )}
          </div>
          {open ? (
            <div className=" sm:visible invisible sm:w-[80%]  h-[100vh] relative bg-background">
              {(() => {
                const fileType = getFileType(file?.url)

                if (fileType === 'pdf') {
                  return (
                    <iframe
                      onLoad={() => setLoad(true)}
                      id="fileEmbed"
                      src={file.url}
                      width="90%"
                      height="100%"
                    />
                  )
                }

                if (fileType === 'image') {
                  return (
                    <img
                      onLoad={() => setLoad(true)}
                      src={file.url}
                      alt="Embedded file"
                      className="object-contain max-h-full max-w-full mx-auto"
                    />
                  )
                }

                return (
                  <div className="text-center w-full h-full flex items-center justify-center">
                    <p className="text-sm">
                      File type not previewable.{' '}
                      <a href={file.url} className="underline" target="_blank">
                        Download file
                      </a>
                    </p>
                  </div>
                )
              })()}

              {loaded ? (
                <></>
              ) : (
                <div className="sm:visible invisible w-[100%] h-[100%] flex justify-center absolute top-0 items-center ">
                  <div className="w-full h-full flex flex-col items-center justify-center gap-10">
                    <svg
                      aria-hidden="true"
                      className="w-10 h-10 text-primary  fill-blue-600 animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>

                    {/* <p className="text-[0.8rem]"> LOADING PROJECTS </p> */}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <></>
          )}

          {/* <Document file={file}/> */}
        </div>
      </AnimatePresence>

      {/* </div> */}
    </>
  )
}

export default AlternativeArchivalCardBlock
