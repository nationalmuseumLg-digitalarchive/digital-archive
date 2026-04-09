import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import * as motion from "framer-motion/client"




import Image from "next/legacy/image"

const AlternativeHeritage = () => {


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


  const Pages = async() => {

  

    const payload = await getPayload({config})
 
   const pages = await payload.find({
     collection:'alternative_heritages',
     draft: false,
     limit: 1000,
 })


 
   return (
       <>
         {
               pages.docs.map((page,i) => { 
                 return <Link key={i} className='border-background uppercase font-semibold text-sm  hover:text-[#006600]' href={`/${page.nav[0].link}`}> {page.nav[0].label}</Link>
 
               })
             }
       
       
       </>
   )
 }
    



  return (
    <>
      <div className='w-[100vw] min-h-[100vh] h-[100%] font-inter flex justify-between bg-background border-black border-t-[1px] flex-row p-8 '>

        <div className='flex justify-between flex-col'>

          <div className='h-fit w-fit flex flex-col  gap-4 text-[0.75rem] sm:text-[1rem]'>
            <h2 className='text-[2rem] sm:text-[3rem] font-bold pb-2 text-primary'>NIGERIAN ALTERNATIVE HERITAGES</h2>

            <div className='w-fit h-fit'> 
            <Image
    
                className="object-contain"
                width={300} height={200}  src="/assets/alternative3.webp" alt="maps " />
            </div>

                {/* <p>Page description will be written here</p>                 */}
                    
          <div className='pb-8 flex flex-col gap-4'>

            <h2 className='font-bold text-[2rem]'>SECTIONS</h2>
            <Pages/>

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

    </>
  )
}

export default AlternativeHeritage