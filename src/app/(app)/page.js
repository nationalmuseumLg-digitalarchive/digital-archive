import Image from "next/legacy/image";
import { getPayload } from "payload";
import config from '@payload-config'
import React, {cache} from 'react'
// import {getData} from '../../utils/fetchContent'
import LandingPage from "@/components/LandingPage";
import { algoliasearch } from 'algoliasearch';

// export const runtime = 'edge'
// import {generateSearchAttributes } from 'payload-plugin-algolia'

const Home = async() => {


const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_WRITE_API_KEY);


const payload = await getPayload({config})
 
const pages = await payload.find({
  collection:'pages',
  draft: false,
  limit: 1000,
})

// for (let i = 0; i < pages.docs.length; i++) {
//   const response = await client.saveObject({
//     indexName: 'pages',
//     body: pages.docs[i]
//   })
    
  
// }




//   const footer = await payload.findGlobal({
//     slug: 'footer'
// })

  return (
    <main className="min-h-screen w-[100vw] font-inter m-0 overflow-hidden">
      <LandingPage />
    </main>
  );
}

export default Home