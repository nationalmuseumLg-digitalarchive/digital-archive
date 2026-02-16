import {Card} from '../blocks/card/Card.js'

export const Pages ={
    slug:'pages',
    fields: [
        {
            name: 'internalName',
            type:'text',
            label:'Internal Name',
            required: true,
            search: true,

        },
        {
            name: 'slug',
            type: 'text',
            label:'Slug',
            admin:{
                position: 'sidebar'
            },
            required: true
          
        },
        {
            name: 'pageSection',
            type: 'group',
            interfaceName: 'Section',
            fields:[
                {
                    name:'layout',
                    label:'layout',
                    type: 'blocks',
                    blocks:[
                            Card
                    ]
                }
             
    
            ]
    
        },
       

    ]
}