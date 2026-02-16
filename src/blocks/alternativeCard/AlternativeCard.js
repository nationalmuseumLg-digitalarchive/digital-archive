export const AlternativeCard = {
    slug: 'alternativeFile',
    labels: {
        singular:'Alternative File',
        plural: 'Alternative Files'
    },
    fields: [
        {
            name:'objectName',
            label: 'Object Name',
            type: 'text',
        },
        {
            name:'localName',
            label: 'Local Name',
            type: 'text',
        },
        {
            name:'accession',
            label: 'Accession Date',
            type: 'text',     
        },
        {
            name:'accessionNumber',
            label: 'Accession Number',
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
            name:'location',
            label: 'Location/Institution',
            type: 'text',     
        },
        {
            name:'aquisition',
            label: 'Aquisition Method',
            type: 'text',     
        },
        {
            name:'production',
            label: 'Production Technique',
            type: 'text',     
        },
        {
            name:'dimensions',
            label: 'Dimensions',
            type: 'row',    
            fields: [
                {
                    name:'height',
                    label: 'Height',
                    type: 'text',
                },
                {
                    name:'width',
                    label: 'Width',
                    type: 'text',
                },
                {
                    name:'breadth',
                    label: 'Bredth',
                    type: 'text',
                },
                {
                    name:'length',
                    label: 'Length',
                    type: 'text',
                },
                {
                    name:'weight',
                    label: 'Weight',
                    type: 'text',
                },
                {
                    name:'circumference',
                    label: 'Circumference',
                    type: 'text',
                }
            ]
        },
        {
            name:'description',
            label: 'Physical Description',
            type: 'textarea',
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
            name:'period',
            label: 'Period/Age',
            type: 'text',
        
        },
        {
            name:'photographer',
            label: 'Photographer',
            type: 'text',
        
        },
        {
            name:'keyword',
            label: 'Keyword',
            type: 'text',
        },
       
        {
            name:'identifiers',
            label: 'Identifiers',
            type: 'text',
            // unique: true
        },
       
        {
            name:'slug',
            label:'slug',
            type:'text',
        },
   
     

    ]
}