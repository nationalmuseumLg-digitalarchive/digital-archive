import { notFound } from 'next/navigation'
import config from '@payload-config'
import { getPayload } from 'payload'
import React, {cache} from 'react'
import { RenderBlocks } from '@/utils/RenderBlocks'
import PaginatedBlocks from '@/components/PaginatedBlocks'
import * as motion from "framer-motion/client"


// Set revalidation period to 60 seconds to balance speed and freshness
export const revalidate = 60

const Page =  async({params}) => {

  

  const {slug} = await params

   const page = await queryPageBySlug({
        slug
    })

    if (!page) {
        return notFound()
    }

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

  return (
    <article>


    <div className='w-[100%]  min-h-[100vh]  overflow-hidden h-[100%] font-montserrat flex flex-col gap-4 p-8'>
         <h1 className='sm:text-[3rem] text-[2rem] font-bold pb-8 uppercase' >{page.internalName}</h1>
       
       <div className='w-[100%] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-2 h-[100%]'>
        {/* <RenderBlocks blocks={page.pageSection.layout}/> */}
        <PaginatedBlocks blocks={page.pageSection.layout} itemsPerPage={20} />

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

          className='w-[100vw] bg-black h-[100vh] top-0 absolute'>


      </motion.div>





    </article>
  )
}

export default Page

  
const queryPageBySlug = cache(async ({ slug }) => {
  const parsedSlug = decodeURIComponent(slug)
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'pages',
    limit: 1,
    where: {
      slug: {
        equals: parsedSlug,
      },
    },
    select: {
      internalName: true,
      pageSection: true,
    },
  })

  return result.docs?.[0] || null
})

export const generateStaticParams = async () => {
  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 5,
    select: {
      slug: true,
    },
  })

  return pages.docs?.map((doc) => ({ slug: doc.slug }))
}
