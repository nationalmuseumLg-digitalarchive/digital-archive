import { GlobalConfig } from "payload";

export const Header: GlobalConfig = {
    slug: 'header',
    fields: [
        {
            name: 'logo',
            label: 'Logo',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name:'nav',
            label:'Navigation',
            type: 'array',
            fields:[
                  {
                name: 'id',
                type: 'text',
                hidden: true,
               },

               { name:'label',
                label: 'Label',
                type: 'text',
               },
               {
                name: 'link',
                label: 'Link',
                type: 'text'
               }
            ]
        }
    ]
}