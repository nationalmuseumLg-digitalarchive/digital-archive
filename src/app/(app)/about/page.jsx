// 'use client'

import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import * as motion from "framer-motion/client"
import React from 'react'
import Image from "next/legacy/image"

const About = () => {


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


    // const payload = await getPayload({config})

    // const pages = await payload.find({
    //   collection:'photos',
    //   draft: false,
    //   limit: 1000,
    // })




return (
 <>
 <div className='flex flex-col w-100% min-h-[100vh] h-fit px-10 overflow-hidden '>

   <div className='w-100% h-fit font-montserrat flex bg-background border-primary flex-col sm:flex-row columns-2 overflow-hidden'>

        <div className="h-fit sm:w-1/2 flex flex-col gap-6 font-light w-full  p-8">
       

            <h1 className="font-montserrat font-bold sm:text-[5rem]"> THE MUSEUM </h1>

              <p className="w-fit font-old text-[0.75rem] sm:text-[16px]">
              NATIONAL MUSEUM LAGOS
              <br />
              <br />
              National Museum Lagos is a specialized sub-sect operating under the National Commission for Museums and Monuments&rsquo; umbrella body. This institution focuses on various specialized areas within the broader organizational framework, including public relations, research, education and development, marketing, and regional operations. Its goal is to bring the museum&rsquo;s offerings to the public, especially those unable to visit, thereby highlighting the importance, value, and pride embedded in Nigerian culture and heritage. 
              </p>
              <p className="w-fit text-[0.75rem]  font-old sm:text-[16px]">
              The museum also conducts skills acquisition empowerment programs to create job opportunities and offers developmental courses for staff members.
              </p>
              <div  className='w-fit h-fit'>

                <Image alt='the national museum lagos' src={'/assets/National-Museum.webp'} width={500} height={300}  loading='lazy' className='object-cover bg-black'/>

                
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

            className='w-[100%] bg-black h-[100vh] left-0 top-0 absolute'>


        </motion.div>

    </div>

    <div className='w-[100%] h-[100%] font-montserrat flex justify-between bg-background border-primary border-x-[1px] border-t-[1px]  flex-col sm:flex-row columns-2 overflow-hidden'>
      <div className="h-[100%] sm:w-1/2 flex flex-col gap-6 font-light w-full p-8">

            <h2 className="font-montserrat font-bold sm:text-[3rem] uppercase "> Activities </h2>

            <h3 className="font-montserrat sm:w-[80%] font-bold sm:text-[1rem] uppercase text-primary"> National Museum Lagos features three galleries: </h3>

              <p className="w-fit font-old text-[0.75rem] sm:text-[16px]">
                  For social, cultural, and educational knowledge, National Museum Lagos features three galleries:
                  <br />
                  <span className='font-semibold font-montserrat'>
                  - Unfading Asset of our Cultural Patrimony Gallery
                  <br />
                  - Nigerian Arts in the Cycle of Life Gallery
                  <br />
                  - Nigerian Government: Yesterday and Today
                  </span>
                </p>

              <h2 className="font-montserrat uppercase sm:first-line:w-[80%] font-bold sm:text-[1rem] text-primary">   Other services of the National Museum Lagos include: </h2>


              <div className="w-fit flex flex-col gap-4 font-old text-[0.75rem] sm:text-[16px]">

                <p>
                    <span className='font-bold text-primary font-montserrat'>
                      Conservation and Restoration Services:
                      <br />
                      </span>
                      National Museum Lagos has a conservation labs where they preserve and restore artifacts and artworks.
                </p>


                <p>
                    
                      <span className='font-bold text-primary font-montserrat'>
                      Retail Services:
                      <br />
                      </span>
                      NML offers a gift shop where visitors can purchase cultural items, souvenirs, books, and other merchandise related to the museum's exhibits and collections.
              
                </p>
                  


                <p>
                    <span className='font-bold text-primary font-montserrat'>
                    Educational Programs:
                    <br />
                    </span>
                    Museums often offer educational workshops, lectures, and classes for visitors of all ages. These programs cover history, art, science, and more, tailored to students, adults, and families.

                </p>

                  <p>
                      <span className='font-bold text-primary font-montserrat'>
                      Organized/Guided Tours:
                      <br />
                      </span>
                      National Museum Lagos provides guided tours led by knowledgeable docents. These tours offer in-depth information about the exhibits and enhance the visitor experience. It is ooen to schools (primary, secondary, and higher institutions), religious groups, clubs, organizations, and associations.
                  </p>

                  <p>
                <span className='font-bold text-primary font-montserrat'>
                Children&rsquo;s Day Program:
                  <br />
                  </span>
                  Celebrated annually with cultural activities aimed at teaching the Nigerian identity, morals, beliefs, and values.

                </p>

                <p>
            <span className='font-bold text-primary font-montserrat'>
            Independence Day Celebration:
            <br />
            </span>
            Celebrates Nigeria&rsquo;s independence with participants mimicking nationalist dress and receiving handmade Nigerian flags.

            </p>

            <p>
            <span className='font-bold text-primary font-montserrat'>
            Digital Resources: 
            <br />
            </span>
            NML provides online access to parts of their collections, virtual tours, educational materials, and digital exhibitions, allowing broader access to their resources.

            </p>
                

            </div>
                  
        </div>

        <div className="h-[100%] font-old  text-[0.75rem] sm:text-[16px] sm:w-1/2 flex flex-col gap-6 font-light w-full  border-black p-8">

            <p>
                <span className='font-bold text-primary font-montserrat'>
                Digital Resources: 
                <br />
                </span>
                NML provides online access to parts of their collections, virtual tours, educational materials, and digital exhibitions, allowing broader access to their resources.

            </p>


            <p>
                <span className='font-bold text-primary font-montserrat'>
                Cultural/Religious Festivals: 
                <br />
                </span>
                NML organizes and participates in cultural festivals that celebrate different traditions, heritage, or religious values, bringing together diverse audiences. Some of such events are: 
                <br />
                ・Eid-Fitr Program: Celebrates the end of Ramadan with cultural activities that remind the populace of their heritage.
                <br />
                ・Christmas Program: Organized for children, featuring Christmas items, cultural activities, games, songs, and dances to celebrate the Yuletide season.
                <br />
                ・Cultural Day Program: Promotes Nigerian culture through various cultural activities, showcasing the unity in Nigeria's cultural diversity.

            </p>


            <p>
                      <span className='font-bold text-primary font-montserrat'>
                      Special Children Program: 
                        <br />
                        </span>
                        Invites children to the museum or takes the museum to them, teaching cultural practices, skills, and more, giving them a sense of societal belonging.
                          s, beliefs, and values.

                  </p>


                  <p>
                      
                        <span className='font-bold text-primary font-montserrat'>
                        Prison (Correctional Service) Outreach: 
                        <br />
                        </span>
                        Designed to reach the underserved population,  provides empowerment and vocational training to prisoners and extends this program to correctional officers' wives.

                  </p>

                  <p>
              <span className='font-bold text-primary font-montserrat'>
              Art Classes and Workshops:
              <br />
              </span>
              National Museum Lagos carries out art classes and workshops where participants can learn various artistic techniques, such as painting, sculpture, photography, and more. Such classes and workshops includes:
              <br />
              ・Training the Trainers Program- trains school art teachers on museum artifacts and skills acquisition.
              <br />
              ・Skills Acquisition (Empowerment) Program-Teaches the production of essential items like vim, liquid soap, air fresheners, designed slippers, tie & dye (batik), local balm, Vaseline, insecticides, Ankara notepads, etc.
              <br />
              ・The 'See, Feel, & Touch' Program- Enhances cultural teachings for secondary school students by allowing them to interact with replicas of Nigerian artifacts.
              <br />
              ・Long Holiday (Arts) Program- Engages secondary students interested in arts with activities like drawing and painting.
              ndmade Nigerian flags.
          </p>
                    
         </div>

    </div>

<div className='w-[100%] h-[100%] font-montserrat flex justify-between bg-background border-primary border-x-[1px] flex-col sm:flex-row columns-2 overflow-hidden'>
  

    <div className="h-[100%] font-old  text-[0.75rem] sm:text-[16px] sm:w-1/2 flex flex-col gap-6 font-light w-full  border-black p-8">

        

            <p>
                <span className='font-bold text-primary font-montserrat'>
                Public Events: 
                <br />
                </span>
                MNL host a variety of public events, including lectures, panel discussions and cultural performances, which are often related to current exhibitions or broader cultural topics.

            </p>


            <p>
                <span className='font-bold text-primary font-montserrat'>
                Children's Digest Magazine Publication:
                <br />
                </span>
                A cultural magazine for children and adults, focusing on Nigerian artifacts, cultural norms, and values, and highlighting the museum's role in cultural preservation.
            </p>

            <p>
                <span className='font-bold text-primary font-montserrat'>
                Exportation of Art Works/Cultural Items:
                <br />
                </span>
                Facilitates the export of art pieces by public and private individuals or organizations to other countries.
            </p>

            <p>
           <span className='font-bold text-primary font-montserrat'>
           Research Facilities: 
            <br />
            </span>
            National Museums Lagos maintains her libraries, archives, and research centers for easy access to academic and historical resources. These facilities support personal development, scholars, students, and the general public in their research endeavors. 

           </p>


    </div>


<div className="h-[100%] font-old  text-[0.75rem] sm:text-[16px] sm:w-1/2 flex flex-col gap-6 font-light w-full border-black p-8">

   

      <p>
          
            <span className='font-bold text-primary font-montserrat'>
            Temporary Exhibitions:
            <br />
            </span>
            In addition to permanent collections, museums regularly organize temporary or traveling exhibitions that showcase different themes, artists, or periods, often in collaboration with other institutions. National Museum Lagos often hosts exhibitions of private or public art collections, drawing attention to the museum.
     
      </p>
        


      <p>
          <span className='font-bold text-primary font-montserrat'>
          Venue Rental for Events: 
          <br />
          </span>
          NML often rents out their spaces for private events, such as weddings, corporate gatherings, and parties, providing a unique and culturally rich environment for special occasions.
      </p>

        <p>
            <span className='font-bold text-primary font-montserrat'>
            Children's Play Park:
            <br />
            </span>
            A designated area for children to learn, play, and have fun.
        </p>


        <p>
            <span className='font-bold text-primary font-montserrat'>
            In sum, the National Museum Lagos is a place of cultural significance, showcasing the richness of Nigeria's cultural heritage and values.
            <br />
            </span>
         

        </p>


</div>

    </div>

    <div className='border-primary border-t-[1px] w-[100%] h-fit p-8'>
      <h2 className='font-bold text-[1rem] sm:text-[3rem] pb-4'>MEET THE CURATOR</h2>
       <div className='font-old pb-8 flex w-fit h-fit flex-col gap-2 object-contain object-center'>
         <Image  alt='the curator' quality={100} src={'/assets/curator.webp'} className='object-contain' width={200} height={300}/>
         <p> 
             Nkechi Olatubosun Adedeji.( Mrs)
             <br />
             Curator, National Museum Lagos.
         </p>
       </div>

    </div>
 </div>

        {/* <Images/> */}
    </>
  )
}

export default About