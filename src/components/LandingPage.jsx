// 'use client'

// import { motion } from "framer-motion"
import * as motion from 'framer-motion/client'
import Link from 'next/link'
// import { useState } from "react"
import Image from 'next/legacy/image'
import Images from './Images'

import { animate } from 'framer-motion'

const LandingPage = () => {
  const anim = {
    initial: {
      y: -100,
    },
    animate: {
      y: 100,
    },
  }

  return (
    <div className="px-4 sm:px-8 lg:px-16 ">
      <section className="w-[100%] h-[80vh] justify-center items-center relative sm:border-[1px] sm:border-t-0 border-black flex flex-col lg:flex-row  bg-background">
        <div className="lg:w-1/2 w-[100%] text-primary h-[100%] relative font-montserrat p-[2rem] flex flex-col justify-center lg:justify-start  truncate text-[13vw] md:text-[7vw] bg-no-repeat bg-landing bg-opacity-50 bg-center  z-0">
          <div className="absolute inset-0 z-[1] bg-background/72 lg:bg-transparent" />
          <motion.div
            // initial={{opacity: 0}}
            // animate={{opacity:1}}
            // transition={{duration:0.3}}
            className="w-[100%]"
          >
            <h1 className=" relative sm:overflow-hidden z-2">
              <motion.div
                // variants={anim}
                initial={{ y: 200 }}
                animate={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                className="absolutue z-2 "
              >
                {' '}
                NATIONAL
              </motion.div>{' '}
            </h1>

            <h1 className="relative sm:overflow-hidden z-2">
              <motion.div
                initial={{ y: 200 }}
                animate={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                className="absolutue z-2"
              >
                MUSEUM
              </motion.div>{' '}
            </h1>

            <h1 className=" relative sm:overflow-hidden z-2">
              <motion.div
                initial={{ y: 200 }}
                animate={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
                className="absolutue z-2"
              >
                LAGOS
              </motion.div>{' '}
            </h1>

            <h2 className=" relative sm:overflow-hidden z-2">
              <motion.div
                initial={{ y: 200 }}
                animate={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
                className="absolutue z-2"
              >
                ARCHIVES
              </motion.div>
            </h2>
          </motion.div>
        </div>

        <div className="relative flex justify-center sm:justify-end border-black text-[0.7rem] md:text-[1rem] w-full h-[50%] sm:h-[100%] md:w-[80vw] lg:w-[50%] ">
          <Link href="/manuscripts" className=" w-[30%] h-[100%]">
            <motion.div
              whileHover={{
                backgroundColor: '#081D07',
                color: '#FFFCF0',
                // scaleX: 1.5,
                x: -4,
              }}
              transition={{ ease: 'easeOut' }}
              className="manuscripts  p-2 sm:p-[1.5rem] bg-backgroundDark border-[0.5px] relative border-black w-[100%] h-[100%] flex flex-col gap-3 sm:gap-6 "
            >
              <div href="/manuscripts" className="">
                <motion.div
                  whileHover={{
                    scaleX: 1.5,
                    x: -8,
                  }}
                  className="absolute invisible lg:visible -z-5 -top-8 left-1/4 lg:top-1/2 lg:-left-8 bg-primary w-[3rem] h-[2rem] lg:w-[2rem] lg:h-[6rem] rounded-t-md lg:rounded-r-none lg:rounded-l-md"
                />
              </div>
              <div className="bg-k.c h-[58%] md:h-1/2 bg-cover bg-center bg-no-repeat w-auto border-black border-[1px]" />

              <div className="md:h-[50%] h-[36%] flex flex-col gap-2 md:gap-4 pr-6">
                <h2 className=" font-bold  ">
                  <br />
                  MANUSCRIPTS
                </h2>

                <p className=" font-light hidden md:block  lg:text-[1vw] text-[1.5vw] ">
                  These are unpublished manuscripts, comprising both handwritten and typed
                  documents, available in various forms and formats.
                </p>

                <div>
                  <motion.svg
                    whileHover={{ scale: 1.4, rotate: '45deg' }}
                    transition={{ ease: 'easeInOut', duration: 0.5 }}
                    className="absolute right-2 bottom-2 sm:right-4 sm:bottom-4 w-3.5 h-3.5 sm:w-5 sm:h-5 hover:fill-background"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#1D1911"
                  >
                    <path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" />
                  </motion.svg>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link href="/intelligence_reports" className=" w-[30%] h-[100%]">
            <motion.div
              whileHover={{
                backgroundColor: '#081D07',
                color: '#FFFCF0',
                // scaleX: 1.5,
                x: -4,
              }}
              transition={{ ease: 'easeOut' }}
              className="intelligent relative  p-2 sm:p-[1.5rem] bg-backgroundDark border-[0.5px] border-black w-[100%]  h-[100%]  flex flex-col gap-3 sm:gap-6 "
            >
              <div href="/intelligence_reports">
                <motion.div
                  whileHover={{
                    scaleX: 1.5,
                    x: -8,
                  }}
                  className="absolute invisible lg:visible -z-5 -top-8 left-1/4 lg:top-1/2 lg:-left-8 bg-primary w-[3rem] h-[2rem] lg:w-[2rem] lg:h-[6rem] lg:rounded-l-md  lg:rounded-r-none  rounded-t-md "
                />
              </div>
              <div className="bg-intelligence h-[58%] md:h-1/2 bg-cover bg-center bg-no-repeat w-auto border-black border-[1px]" />

              <div className="md:h-[50%] h-[36%] flex flex-col gap-2 md:gap-4 pr-6">
                <h2 className="font-bold">
                  INTELLIGENCE
                  <br />
                  REPORTS
                </h2>

                <p className=" font-light hidden md:block lg:text-[1vw] text-[1.5vw]">
                  Intelligence reports are documents or briefings that provide insights, analyses,
                  and assessments on a range of issues.
                </p>
                <div>
                  <motion.svg
                    whileHover={{ scale: 1.4, rotate: '45deg' }}
                    transition={{ ease: 'easeInOut', duration: 0.5 }}
                    className="absolute right-2 bottom-2 sm:right-4 sm:bottom-4 w-3.5 h-3.5 sm:w-5 sm:h-5 hover:fill-background"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#1D1911"
                  >
                    <path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" />
                  </motion.svg>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link href="/maps" className=" w-[30%] h-[100%]">
            <motion.div
              whileHover={{
                backgroundColor: '#081D07',
                color: '#FFFCF0',
                // scaleX: 1.5,
                x: -4,
              }}
              transition={{ ease: 'easeOut' }}
              className="maps relative p-2 sm:p-[1.5rem] bg-backgroundDark border-[0.5px] border-black w-[100%] h-[100%] flex flex-col gap-3 sm:gap-6"
            >
              <div href="/maps">
                <motion.div
                  whileHover={{
                    scaleX: 1.5,
                    x: -8,
                  }}
                  className="absolute invisible lg:visible -z-5 -top-8 left-1/4 lg:top-1/2 lg:-left-8 bg-primary w-[3rem] h-[2rem] lg:w-[2rem] lg:h-[6rem] rounded-t-md  lg:rounded-r-none  lg:rounded-l-md"
                />
              </div>
              <div className="bg-maps h-[58%] md:h-1/2 bg-cover bg-center bg-no-repeat w-auto border-black border-[1px]" />
              <div className="md:h-[50%] h-[36%] flex flex-col gap-2 md:gap-4 pr-6">
                <h2 className="font-bold">MAPS</h2>

                <p className=" font-light hidden md:block  lg:text-[1vw] text-[1.5vw]">
                  Maps of Nigeria providing detailed visual representations of regions, vegetation
                  zones, geographic locations, waterways, and other essential information.
                </p>

                <div>
                  <motion.svg
                    whileHover={{ scale: 1.4, rotate: '45deg' }}
                    transition={{ ease: 'easeInOut', duration: 0.5 }}
                    className="absolute right-2 bottom-2 sm:right-4 sm:bottom-4 w-3.5 h-3.5 sm:w-5 sm:h-5 hover:fill-background"
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#1D1911"
                  >
                    <path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" />
                  </motion.svg>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* about */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        //  viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        id="museum"
        className="h-[100%] w-[100%] items-center text-[0.75rem] sm:text-[1rem] flex lg:flex-row flex-col gap-4 border-b-black border-b-[1px]"
      >
        <div className="h-[100%]  px-5 sm:px-8 lg:px-10 py-8 lg:py-[1.5rem]  lg:w-1/2 flex flex-col gap-6 font-light w-full lg:border-r-[1px]  lg:pt-10 lg:pb-10  border-black">
          <h2 className="font-montserrat font-bold text-[1.75rem] md:text-[4vw]"> THE MUSEUM </h2>

          <p className="w-fit text-[0.875rem] leading-relaxed sm:text-[16px]">
            NATIONAL MUSEUM ONIKAN, LAGOS NIGERIA <br />
            <br />
            National Museum Lagos is a specialized sub-sect operating under the National Commission
            for Museums and Monuments' umbrella body. This institution focuses on various
            specialized areas within the broader organizational framework, including public
            relations, research, education and development, marketing, and regional operations. Its
            goal is to bring the museum's offerings to the public, especially those unable to visit,
            thereby highlighting the importance, value, and pride embedded in Nigerian culture and
            heritage. The museum also conducts skills acquisition empowerment programs to create job
            opportunities and offers developmental courses for staff members.
          </p>
          <p className="w-fit text-[0.875rem] leading-relaxed   sm:text-[16px]">
            Its goal is to bring the museum's offerings to the public, especially those unable to
            visit, thereby highlighting the importance, value, and pride embedded in Nigerian
            culture and heritage.
          </p>

          <div className="flex w-[100%] justify-between gap-4 flex-col lg:flex-row h-[100%]">
            <video width="420" height="320" autoPlay muted loop preload="none" className="w-full max-w-full h-auto sm:w-[420px]">
              <source src="/assets/museum.mp4" type="video/mp4" />
            </video>

            <Link
              href="/about"
              className="flex items-end text-[0.75rem] md:text-[1rem] gap-1 font-semibold hover:text-[#006600] font-montserrat pr-4"
            >
              READ MORE
              <motion.svg
                whileHover={{ scale: 1.4, rotate: '45deg' }}
                transition={{ ease: 'easeInOut', duration: 0.5 }}
                className="w-4 h-4 sm:w-5 sm:h-5"
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#1D1911"
              >
                <path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" />
              </motion.svg>
            </Link>
          </div>
        </div>

        <div className="h-[100%] lg:w-1/2 gap-6 font-light w-full flex flex-col items-between  px-5 sm:px-8 lg:px-10 md:border-0 border-r-[1px] py-8 lg:pt-10 lg:pb-10  border-black bg-backgroundDark">
          <div>
            <h2 className="font-montserrat font-bold text-[1.75rem] md:text-[4vw]"> PHOTO GALLERY </h2>
            <Images />
          </div>

          <Link
            href="./photos"
            className="flex flex-row font-semibold left-0  pb-10 w-full h-[10%] items-end text-[0.75rem] md:text-[1rem] gap-1 hover:text-[#006600] font-montserrat pr-4"
          >
            VIEW MORE
            <motion.svg
              whileHover={{ scale: 1.4, rotate: '45deg' }}
              transition={{ ease: 'easeInOut', duration: 0.5 }}
              className="w-4 h-4 sm:w-5 sm:h-5"
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#1D1911"
            >
              <path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" />
            </motion.svg>
          </Link>
        </div>
      </motion.div>

      {/* <div className="p-4 w-1/2 ">
           <Search />

        </div> */}
    </div>
  )
}

export default LandingPage
