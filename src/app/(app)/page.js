import Image from "next/legacy/image";
import { getPayload } from "payload";
import config from '@payload-config'
import React, {cache} from 'react'
// import {getData} from '../../utils/fetchContent'
import LandingPage from "@/components/LandingPage";
// export const runtime = 'edge'

// Declared on the homepage only — a canonical in the root layout would be
// inherited by every route and tell search engines they are all this page.
export const metadata = {
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: '/',
  },
}

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