import Image from "next/legacy/image";
import { getPayload } from "payload";
import config from '@payload-config'
import React, {cache} from 'react'
// import {getData} from '../../utils/fetchContent'
import LandingPage from "@/components/LandingPage";
// export const runtime = 'edge'

const Home = async () => {
  // Unused expensive query removed to optimize performance and prevent timeouts on Cloudflare.




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