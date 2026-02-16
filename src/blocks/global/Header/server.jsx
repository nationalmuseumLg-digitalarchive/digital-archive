
import React from 'react'
import config from '@payload-config'
import Image from "next/legacy/image"
import Nav from '@/components/Nav'
import Link from 'next/link'
import { section } from 'framer-motion/client'
import Search from '../../../components/Search'
import { getPayload } from 'payload'



//   const SECTIONS = async() => {



//     return <div className='h-fit w-fit p-7 bg-primary text-background flex flex-col gap-4 z-10 text-[0.75rem]'>
//       {
//         pages.docs.map((page) => {
//           return <Link className='hover:border-b-2 border-background' href={`/${page.slug}`}> {page.internalName}</Link>

//         })
//       }
//       {/* <Link className='hover:border-b-2 border-background' href="/k.c_murray_manuscripts"> K.C MANUSCRIPTS</Link>
//       <Link className='hover:border-b-2 border-background' href="/intelligent_reports"> INTELLIGENT REPORTS</Link>
//       <Link className='hover:border-b-2 border-background' href="/government_reports"> GOVERNMENT REPORTS</Link>
//       <Link className='hover:border-b-2 border-background'href=""> PHOTOS</Link> */}
//     </div>
// } 




const HeaderServer = async() => {






 
    // params.map((d oc) => {
    //   sections.push(doc.internalName)
    // })
 
    const payload = await getPayload({config})

    const header = await payload.findGlobal({
        slug: 'header',
        // draft: true,
    })

    const navItems = header?.nav || []

  //   const footer = await payload.findGlobal({
  //     slug: 'footer'
  // })

  const intelligence_reports = await payload.find({
    collection:'intelligence_reports',
    draft: false,
    limit: 1000,
  })

  const manuscripts = await payload.find({
    collection:'manuscripts',
    draft: false,
    limit: 1000,
  })

  const maps = await payload.find({
    collection:'maps',
    draft: false,
    limit: 1000,
  })

  const government_reports = await payload.find({
    collection:'government_reports',
    draft: false,
    limit: 1000,
  })

  const alternative_archival_heritages = await payload.find({
    collection:'alternative_archival_heritages',
    draft: false,
    limit: 1000,
  })

  const alternative_heritages = await payload.find({
    collection:'alternative_heritages',
    draft: false,
    limit: 1000,
  })










 

  //   const pages = await payload.find({
  //     collection:'pages',
  //     draft: false,
  //     limit: 1000,
  // })
  


// console.log(government_reports)

  return (
    // <div>
    // </div>
    (<div className="flex relative items-center justify-center w-[100%]  h-fit py-4 border-b-[1px] border-primary px-8 z-20">
      {/* <div className='w-[100%] h-[100%] pl-4'> */}
      <div className='w-fit h-fit '>

      <Link  href={'/'} className='justify-self-start'
       style={{
        paddingLeft:'1rem',
        bottom: '4px'
       }}
      >

          <Image 
              // layout='fill'
              width={35}
              height={40}
              // sizes="(max-width: 768px) 500px, (max-width: 1200px) 1000px, 33vw"
              src={header.logo.url} alt='logo'
              className='aspect-square'
              />
 
      </Link>
      </div>

      {/* </div> */}
      <Nav className="" pages={navItems} alternative_heritages={alternative_heritages} alternative_archival_heritages={alternative_archival_heritages}  intelligence_reports={intelligence_reports} manuscripts={manuscripts} maps={maps} government_reports={government_reports}/>
      {/* <div className='w-fit flex justify-center items-center right-4 p-4 top-4 h-fit invisible lg:visible'>
         <Search/>
      </div> */}
    </div>)
  );
}

export default HeaderServer