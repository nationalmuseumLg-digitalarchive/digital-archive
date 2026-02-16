export const Photos = {
    slug: 'photos',
    labels: {
        singular:'photo',
        plural: 'photos'
    },
    fields: [
        {
            name:'image',
            label: 'Image',
            type: 'upload',
            relationTo: 'media',
             admin: {
        disablePreview: true
      },
        },
        {
            name:'description',
            label: 'Description',
            type: 'textarea',
            
        },

    ]
}