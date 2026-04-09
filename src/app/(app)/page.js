import Image from "next/legacy/image";
import { getPayload } from "payload";
import config from '@payload-config'
import React, {cache} from 'react'
// import {getData} from '../../utils/fetchContent'
import LandingPage from "@/components/LandingPage";
// export const runtime = 'edge'

const Home = async() => {


const payload = await getPayload({config})
 
const pages = await payload.find({
  collection:'pages',
  draft: false,
  limit: 1000,
})




//   const footer = await payload.findGlobal({
//     slug: 'footer'
// })

  return (
    <main className="min-h-screen w-[100vw] font-montserrat m-0 overflow-hidden">
      <LandingPage />
    </main>
  );
}

export default Home