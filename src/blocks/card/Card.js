export const Card = {
    slug: 'file',
    labels: {
        singular:'File',
        plural: 'Files'
    },
    fields: [
        {
            name:'title',
            label: 'Title',
            type: 'text',
            search: true,
        },
        {
            name:'image',
            label: 'Image',
            type: 'upload',
            relationTo: 'media'
        },
        {
            name:'description',
            label: 'Description',
            type: 'textarea',
            
            // required: true,   
        },
        {
            name:'creation',
            label: 'Year of Creation/Publication',
            type: 'text',     
        },
        {
            name:'accession',
            label: 'Year of Accession',
            type: 'text',     
        },
        {
            name:'file',
            label: 'File',
            type:'upload',
            relationTo: 'media',
            required: true,
             admin:{
                disablePreview: true,
                disabled: true,
            }
        },
        {
            name:'authors',
            label: 'Authors',
            type: 'text',
        
        },
        {
            name:'keyword',
            label: 'Keyword',
            type: 'text',
            search: true,
        },
        {
            name:'condition',
            label: 'Condition',
            type: 'text',
        },
        {
            name:'location',
            label: 'Location',
            type: 'text',
        },
        {
            name:'rights',
            label: 'Rights',
            type: 'text',
           
        },
        {
            name:'identifiers',
            label: 'Identifiers',
            type: 'text',
            unique: true
        },
        {
            name:'provenance',
            label: 'Provenance',
            type: 'text',
        },
        {
            name:'slug',
            label:'slug',
            type:'text',
        },
   
     

    ]
}