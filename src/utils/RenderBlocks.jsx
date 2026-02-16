"use client"

import { Page } from '@/payload-types'
import React, { Fragment } from 'react'
import CardBlock from '../blocks/card/Server'
import AlternativeCardBlock from '../blocks/alternativeCard/Server'
import AlternativeArchivalCardBlock from '../blocks/alternativeArchivalCard/Server'



const blockComponents = {
    file: CardBlock,
    alternativeFile: AlternativeCardBlock,
    alternativeArchivalFile: AlternativeArchivalCardBlock,
  
}

export const RenderBlocks = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {

    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  <Block id={blockName} {...block} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
