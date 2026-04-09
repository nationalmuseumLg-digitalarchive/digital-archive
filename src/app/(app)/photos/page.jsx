// 'use client'

import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import * as motion from "framer-motion/client"
import React from 'react'
import Image from "next/legacy/image"

const Photos = async() => {


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
      collection:'photos',
      draft: false,
      limit: 1000,
    })




return (
 <>
   <div className='w-[100%] min-h-[100vh] h-[100%] font-montserrat flex justify-start bg-background border-black border-t-[1px] p-8 overflow-hidden'>

     {/* <div className='flex justify-between flex-col'> */}

       <div className='h-fit w-full text-primary flex flex-col gap-4 text-[0.75rem] sm:text-[1rem px-8'>
         <h2 className='text-[2rem] sm:text-[3rem] uppercase font-bold pb-2'>Photo gallery</h2>

         {/* <Image /> */}
             {/* <p>Page description will be written here</p>                 */}
                 
       <div 
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, auto)'
            }}
          className='p-4 grid  w-[100%] h-fit justify-center gap-8  items-center'> 

          {
              pages.docs.map((page,i) => { 
                return (
                  <div key={page.id} id={page.id} className='flex flex-col justify-start items-start p-4 gap-2 w-fit h-auto border-primary px-10 aspect-square rounded-md'>
                      <div className='relative aspect-video flex justify-start w-[100%] h-[100%]'>
                         <Image
                             layout='fill'
                            //  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 30vw"
                              alt={page.image.alt}
                              // objectFit='contain'
                              loading='lazy'
                              
                              width={500}
                              height={500}
                        
                            src={page.image.url} className='object-center object-contain'/>
        
                      </div>
                      
                        <p className='font-old  text-slate-800'>{page.description}</p>
        
                 </div>
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

    {/* </div> */}
        {/* <Images/> */}
    </>
  )
}

export default Photos