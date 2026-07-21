import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from "next/legacy/image"

const Manuscripts = () => {




// const Pages = async() => {

  

//    const payload = await getPayloadHMR({config})

//   const pages = await payload.find({
//     collection:'manuscripts',
//     draft: false,
//     limit: 1000,
// })

//   return (
//       <>
//            {
//                pages.docs.map((page,i) => { 
//                  return <Link key={i} className='border-background uppercase font-semibold text-sm  hover:text-[#006600]' href={`/${page.nav[0].link}`}> {page.nav[0].label}</Link>
 
//                })
//              }
      
//       </>
//   )
// }
   


  return (
    <>
      <div className='w-[100vw] min-h-[100vh] h-[100%]  relative flex justify-between bg-background border-black border-t-[1px] flex-row p-8 '>

        <div className='flex justify-between flex-col'>

          <div className='h-fit w-fit flex flex-col gap-4 z-10 text-[0.75rem] sm:text-[1rem]'>
          <h2 className='text-[2rem] sm:text-[3rem] text-primary font-bold pb-2 '>K.C. MURRAY MANUSCRIPTS</h2>

          <div className='w-fit h-fit'> 
          <Image
                className="objact-contain"
                width={100} height={200}  src="/assets/K.C-Murray.webp" alt="k.c. murray photo" />
          </div>
                <p className='text-[18px] w-[70%]'>
                 K.C. Murray manuscripts are not published. Some are hand written and some are typed. There are varieties of manuscript, such as Education, Field work, Correspondence, Notes and Expeditions.
                  </p>                
                    
          <div className='pb-8 flex flex-col gap-3'>

            <h2 className='font-bold text-[0.65rem] tracking-[0.2em] text-black/40 uppercase pb-1'>SECTIONS</h2>

            <Link className='group flex items-center justify-between sm:min-w-[360px] px-5 py-4 bg-primary text-background uppercase font-bold text-xs sm:text-sm tracking-widest hover:bg-primary-light active:opacity-80 transition-all duration-200' href={'/manuscripts/k.c_murray/k.c_murray_expeditions'}>
              <span>K.C. Murray Expedition</span>
              <span className='ml-6 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200'>→</span>
            </Link>

            <Link className='group flex items-center justify-between sm:min-w-[360px] px-5 py-4 bg-primary text-background uppercase font-bold text-xs sm:text-sm tracking-widest hover:bg-primary-light active:opacity-80 transition-all duration-200' href={'/manuscripts/k.c_murray/k.c_murray_correspondence'}>
              <span>K.C. Murray Correspondence</span>
              <span className='ml-6 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200'>→</span>
            </Link>

            <Link className='group flex items-center justify-between sm:min-w-[360px] px-5 py-4 bg-primary text-background uppercase font-bold text-xs sm:text-sm tracking-widest hover:bg-primary-light active:opacity-80 transition-all duration-200' href={'/manuscripts/k.c_murray/k.c_murray_education'}>
              <span>K.C. Murray Education</span>
              <span className='ml-6 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200'>→</span>
            </Link>

            <Link className='group flex items-center justify-between sm:min-w-[360px] px-5 py-4 bg-primary text-background uppercase font-bold text-xs sm:text-sm tracking-widest hover:bg-primary-light active:opacity-80 transition-all duration-200' href={'/manuscripts/k.c_murray/k.c_murray_field_works'}>
              <span>K.C. Murray Field Works</span>
              <span className='ml-6 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200'>→</span>
            </Link>

            <Link className='group flex items-center justify-between sm:min-w-[360px] px-5 py-4 bg-primary text-background uppercase font-bold text-xs sm:text-sm tracking-widest hover:bg-primary-light active:opacity-80 transition-all duration-200' href={'/manuscripts/k.c_murray/k.c_murray_notes'}>
              <span>K.C. Murray Notes</span>
              <span className='ml-6 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200'>→</span>
            </Link>

          </div>
      
            </div> 


        </div>

   


          {/* <Image src={footer.logo.url} alt='logo' width={64} height={20} className=' p-4 object-contain'/> */}


        

   

        </div>

    </>
  )
}

export default Manuscripts