// 'use client'

import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import * as motion from "framer-motion/client"
import React from 'react'
import Image from "next/legacy/image"

const Maps = async() => {


  const anim ={
    initial: {
      width:'100vw',
      // x: '100vw'
    },
    open: {
      width:'0',
      // x: 0
    },
    closed :{
      width:'100vw',
    }
  }


    const payload = await getPayload({config})

    const pages = await payload.find({
      collection:'maps',
      draft: false,
      limit: 1000,
    })




return (
 <>
   <div className='w-[100%] min-h-[100vh] h-[100%] font-montserrat flex justify-between  border-black border-t-[1px] flex-row py-8 px-10  overflow-hidden'>

     <div className='flex justify-between items-start flex-col'>

       <div className='h-fit w-fit text-primary flex flex-col gap-4 text-[0.75rem] sm:text-[1rem]'>
         <h1 className='text-[2rem] sm:text-[3rem] uppercase font-bold pb-2'>MAPS</h1>
         {/* <Image
                style={{objectFit: "contain"}}
                className=""
                width={300} height={100}  src="/assets/Museum5.webp" alt="maps" />
                 */}
                <p className='font-old'> Maps of Nigeria providing detailed visual representations of regions, vegetation zones, geographic locations, waterways, and other essential information.</p>                
          
       <div className='p-8 grid-cols-1 grid w-[100%] justify-center h-fit gap-4'> 

          {
              pages.docs.map((page,i) => { 
            
                return (
                  page.image.url 
                    ?

                  <div key={page.id} id={page.id} className='flex flex-col justify-between items-start p-2 gap-2 w-[90%] h-[50vh] sm:h-[100vh] border-primary rounded-md '>
                      <div className='block relative w-[100%] h-[100%]'>
                         <Image
                             layout='fill'
                              alt={page.image.alt}
                              loading='lazy'
                              
                              // width={500}s
                              // height={500}
                        
                            src={page.image.url} className=' object-contain'/>
        
                      </div>
                        
                     
        
                        <p className='font-montserrat font-light'>{page.description}</p>
        
                 </div>
                 :
                 page.file.url
                 ?


                  <div key={page.id} id={page.id} className='flex flex-col justify-between items-start p-2 gap-2 w-[90%] h-[50vh] sm:h-[100vh] border-primary rounded-md '>
                  <div className='block relative w-[100%] h-[100%]'>
                     <Image
                         layout='fill'
                          alt={page.image.alt}
                          loading='lazy'
                          
                          // width={500}s
                          // height={500}
                    
                        src={page.image.url} className=' object-contain'/>
    
                  </div>
                    
                 
    
                    <p className='font-montserrat text-sm opacity-10 font-light text-center w-full'>{page.description}</p>
    
             </div>
             :
             <></>
                  
                 
                
                 
                )

              })
            }
        
       </div>
   
         </div> 


     
         
      

     </div>


   <motion.div 
       variants={anim}
       initial='initial'
       animate='open'
       exit='closed'
       transition={{
         duration: 0.4,
         ease: 'easeOut'
       }}

       className='w-[100vw] bg-black h-[100vh] left-0 top-0 absolute'>


   </motion.div>

    </div>
        {/* <Images/> */}
    </>
  )
}

export default Maps