import { AlternativeCard } from '../blocks/alternativeCard/AlternativeCard'
import { AlternativeArchivalCard } from '../blocks/alternativeArchivalCard/AlternativeArchivalCard'

export const AlternativePages = {
  slug: 'alternativePages',
  admin: {
    // pagination: { defaultLimit: 20, limits: [20, 50, 100] },
    // disablePreview: true,
    // useAsTitle: 'alt',
  },
  fields: [
    {
      name: 'internalName',
      type: 'text',
      label: 'Internal Name',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      admin: {
        position: 'sidebar',
      },
      required: true,
      index: true,
    },
    {
      name: 'section',
      type: 'select',
      admin: { position: 'sidebar' },
      defaultValue: 'alternative_heritages_objects',
      options: [
        { label: 'Alternative Heritage Objects', value: 'alternative_heritages_objects' },
        { label: 'Alternative Heritage Archival', value: 'alternative_heritage_archival' },
      ],
    },
    {
      name: 'pageSection',
      type: 'group',
      interfaceName: 'Section',
     
      fields: [
        {
          name: 'layout',
          label: 'layout',
          type: 'blocks',
          blocks: [AlternativeCard, AlternativeArchivalCard],
          // maxRows: 50, 
         admin: {
    initCollapsed: true,
    isSortable: false,
  }
        },
      ],
       admin: {
    pagination: { defaultLimit: 20, maxLimit: 50 }
  }

    },
    {
      name: 'ethnographicItems',
      label: 'Ethnographic Items',
      type: 'relationship',
      relationTo: 'ethnographicItems',
      hasMany: true,
      admin: {
        position: 'main',
        isSortable: false,
      }
    },
  ],

   
}
