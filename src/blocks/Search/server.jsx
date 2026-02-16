
import React from 'react'
import config from '@payload-config'
import Image from "next/legacy/image"
import Nav from '@/components/Nav'
import Link from 'next/link'
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




const SearchServer = async() => {




 
    // params.map((doc) => {
    //   sections.push(doc.internalName)
    // })
 
    const payload = await getPayload({config})

    const header = await payload.findGlobal({
        slug: 'header'
    })

 

    const pages = await payload.find({
      collection:'pages',
      draft: false,
      limit: 1000,
  })
  




  return (
    <div>
        <div className=" w-[100vw] h-fit sticky">
              <Image src={header.logo.url} alt='logo' width={64} height={20} className='absolute p-4 object-contain'/>
               
               <Nav pages={pages}/>

        </div>
    </div>
  )
}

export default SearchServer