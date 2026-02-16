// import {Card} from '../blocks/card/Card.js'
export const GovernmentReports = {
    slug:'government_reports',
    fields: [
        {
            name: 'internalName',
            type:'text',
            label:'Internal Name',
            required: true

        },
        {
            name:'nav',
            label:'Navgation',
            type: 'array',
            fields:[
               { name:'label',
                label: 'Label',
                type: 'text',
               },
               {
                name: 'link',
                label: 'Link',
                type: 'text'
               }
            ],
            minRows:1
        },
      
    ]
}