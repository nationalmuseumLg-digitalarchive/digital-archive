'use client'

import Image from "next/legacy/image"
import Link from "next/link"
import { motion, useMotionValue } from "framer-motion"
import { useEffect, useState } from "react"

const imgs =[
  '/assets/alternative2.webp',
  '/assets/K.C-Murray.webp',
  '/assets/National-Museum.webp',
  '/assets/Intelligence.webp',
  '/assets/Museum3.webp'
]


const Photos = () => {
  return (

    <>

        {imgs.map((imgSrc, id) => {
          return <div
                key={id}
                style={{
                    backgroundImage: `url(${imgSrc})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center'

                }}

                className="aspect-video w-full shrink-0 rounded-sm bg-no-repeat bg-neutral-800 object-contain"
              >

          </div>
        })}
    </>
  )
}

const DRAG_BUFFER = 40;
const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 10;
const SPRING_OPTION ={ 
  type: "spring",
  mass: 3,     
  stiffness: 300,
  damping: 50  
} 

const Images = () => {



  const [dragging, setDragging] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)

  const dragX = useMotionValue(0)


  const onDragStart =() =>{
    setDragging(true)
  }

  const onDrageEnd =() =>{
    setDragging(false)

    const x = dragX.get()

    if (x <= -DRAG_BUFFER && imgIndex < imgs.length - 1){
      setImgIndex((pv) => pv + 1)
    } else if(x <= -DRAG_BUFFER && imgIndex > 0) {
      setImgIndex((pv) => pv - 1)

    }

  }


  useEffect(() => {
    const intervalRef = setInterval(() => {
        const x =dragX.get()
        if( x === 0) {
          setImgIndex(pv => {
            if (pv === imgs.length - 1 ) {
              return 0
            }
            return pv + 1
          })
        }
    }, AUTO_DELAY)
    return () => clearInterval(intervalRef)
  },[])

    // const ref = useRef()

    const imageStyle = {
      borderRadius: '50%',
      border: '1px solid #fff',
      position: 'contain'
    }

  return (
    <> 

<div className="flex flex-col items-between h-[100%]">

    <div className=" w-full  md:border-0 border-black h-[100%] overflow-hidden">


      <motion.div 

          drag='x'
          dragConstraints={{
            left:0,
            right:0,
          }}
          animate={{
            translateX: `-${imgIndex * 100}%`,
          }}
          transition={SPRING_OPTION}
          style={{
            x:dragX
          }}
          onDragStart={onDragStart}
          onDragEnd={onDrageEnd}
          className="flex cursor-grab z-10 items-center active:cursor-grabbing">
              <Photos/>
      </motion.div>

      

      <Dots imgIndex={imgIndex} setImgIndex={setImgIndex}/>

        
      </div>



          </div>


         
         


   

     {/* <Image url=''/> */}

    </>
  )
}

const Dots = ( {imgIndex, setImgIndex}) => {
  return (
  <div className="mt-4 flex w-full justify-center gap-2">
        {imgs.map((img,idx) => {
          return <button
            key={idx}
            onClick={() => setImgIndex(idx)}
            className={`h-3 w-3 rounded-full transition-colors ${idx === imgIndex ? "bg-primary": "bg-neutral-500"}`}
          
          />
        })}
  </div>)
}

export default Images