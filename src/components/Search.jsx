'use client'

import React from 'react'
import Link from 'next/link'
import { algoliasearch } from 'algoliasearch';
// import {InstantSearchNext} from 'react-instantsearch-nextjs'
import {InstantSearch, SearchBox, Hits, Highlight, Pagination} from 'react-instantsearch';
import Image from "next/legacy/image"
import useStore from '../utils/useStore'
import { div } from 'framer-motion/client';

const Search = ({pages}) => {

// console.log(pages)

const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY);



  return (
    <>
        <div className="h-fit w-64 flex justify-start border-black ">
          <div className=" w-full flex flex-col gap-8">   

          <InstantSearch indexName='pages' searchClient={searchClient} insights>
            <div>
              <SearchBox 
                placeholder='Search Archives'
                classNames={{
                input:
                "block w-full p-2  text-sm border-[1px] rounded-md text-black border-primary bg-[#FFFDF5] focus:ring-primary focus:border-primary dark:text-primary",
                submitIcon: 'hidden',
                form:'relative text-[0.75rem] font-light',
                resetIcon:'absolute right-2 top-4 w-10',
                placeholder:'font-old text-[18px] dark:text-primary'

              
              }}/>
              <Hits hitComponent={Hit}/>
              {/* <Pagination/> */}
            </div>

          </InstantSearch>

{/* 
              <form class="w-[100%] ">   
                <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-primary rounded-lg bg-background focus:ring-primary focus:border-primary  dark:text-black" placeholder="Search archive" required />
                    <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary dark:hover:bg-primary ">Search</button>
                </div>
              </form> */}

              {/* <div className=" font-inter font-light flex flex-col gap-4">
                  <p>Select a section below to browse</p>
                  <div className='h-fit w-fit text-primary flex flex-col gap-4 z-10 text-[0.75rem]'>
                  {
              pages.nav.map((link,i) => { 
                return <Link key={i} className='border-background' href={`/${link.link}`}> {link.label}</Link>

              })
            }
      
            </div> 

              </div> */}



          </div>
      

        </div>
        
    </>
  )
}

export default Search


function Hit({ hit,
  
 }){

  const updateOpenCard = useStore((state) => state.updateOpenCard)
  const updateCardId = useStore((state) => state.updateCardId)


  const handeClick = (cardID) =>{
    updateCardId(cardID)
    updateOpenCard(true)
  }


  return (
    <>  
     <div className='flex flex-col gap-4'>

      {
        hit.page.pageSection.layout.map((card,i) => {

           if(hit._highlightResult.page.pageSection){
              if(hit._highlightResult.page.pageSection.layout[i].description.matchLevel === 'none' && hit._highlightResult.page.pageSection.layout[i].year.matchLevel === 'none' && hit._highlightResult.page.pageSection.layout[i].keyword.matchLevel === 'none')
              {return null}
            }

   

          return (

           
              <Link key={card.id} id={card.id} href={`/${hit.link}#${card.id}`} onClick={() => handeClick(card.id)} className='flex gap-4 bg-primary text-background font-inter text-[0.75rem] p-2 rounded-md'>
                <Image width={50} height={20} src={card.image.url} alt={card.image.alt}/>
                {/* <h1>{hit._highlightResult.description.value}</h1> */}
                <div className='flex flex-col gap-2'>
                    <p dangerouslySetInnerHTML={{__html:hit._highlightResult.page.pageSection.layout[i].description.value }}></p>
                    <p dangerouslySetInnerHTML={{__html:hit._highlightResult.page.pageSection.layout[i].year.value }}></p>
                    <p dangerouslySetInnerHTML={{__html:hit._highlightResult.page.pageSection.layout[i].keyword.value }}></p>
                </div>
          
                  <h1>
                    <Highlight attribute="name" hit={hit} />
                  </h1>
          
              </Link>)   
        })
      }


    </div>
    </>
  )

}