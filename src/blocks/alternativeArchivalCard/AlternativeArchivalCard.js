export const AlternativeArchivalCard = {
    slug: 'alternativeArchivalFile',
    labels: {
        singular:'Alternative Archival File',
        plural: 'Alternative Archival Files'
    },
    fields: [
        {
            name:'NAHA',
            label: 'NAHA',
            type: 'text',
        },
        {
            name:'author',
            label: 'Author',
            type: 'text',
        },
        {
            name:'objectType',
            label: 'Object Type',
            type: 'text',     
        },
        {
            name:'ethnicityGroup',
            label: 'Ethnicity Group',
            type: 'text',     
        },
        {
            name:'image',
            label: 'Image',
            type: 'upload',
            relationTo: 'media',
            admin:{
                disablePreview: true,
                // disabled: true,
            }
        },
        {
            name:'artist',
            label: 'Artist',
            type: 'text',     
        },
        {
            name:'geographicOrigin',
            label: 'Geographic Origin',
            type: 'text',     
        },
    
        {
            name:'description',
            label: 'Description of use, function and meaning in traditional context ',
            type: 'text area',
            // required: true,   
        },
        {
            name:'provenance',
            label: 'Provenance',
            type: 'text',
        },
        {
            name:'entry',
            label: 'Date of entry',
            type: 'text',     
        },
        {
            name:'staff',
            label: 'Staff',
            type: 'text',     
        },
      
        {
            name:'file',
            label: 'File',
            type:'upload',
            relationTo: 'media',
            // required: true,
            admin:{
                disablePreview: true,
                // disabled: true,
            }
        },
        {
            name:'identifiers',
            label: 'Identifiers',
            type: 'text',
            // unique: true
        },

     

    ]
}