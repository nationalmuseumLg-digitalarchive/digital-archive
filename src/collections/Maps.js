import { Card } from "@/blocks/card/Card"

export const Maps ={
    slug:'maps',
    labels: {
        singular:'map',
        plural: 'maps'
    },
    fields: [
        {
            name:'image',
            label: 'Image',
            type: 'upload',
            relationTo: 'media',
               admin: {
        // disablePreview: true
      }
        },
        {
            name:'file',
            label: 'File',
            type: 'upload',
            relationTo: 'media',
               admin: {
        // disablePreview: true
      }

        },
        {
            name:'description',
            label: 'Description',
            type: 'textarea',
            
        },
      
    ]
}