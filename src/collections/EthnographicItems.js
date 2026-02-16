export const EthnographicItems = {
  slug: 'ethnographicItems',
  labels: {
    singular: 'Ethnographic Item',
    plural: 'Ethnographic Items'
  },
  admin: {
    pagination: { defaultLimit: 50, limits: [50, 100, 200] },
    useAsTitle: 'objectName',
    defaultColumns: ['objectName', 'accessionNumber', 'location'],
  },
  fields: [
    {
      name: 'objectName',
      label: 'Object Name',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'localName',
      label: 'Local Name',
      type: 'text',
    },
    {
      name: 'accession',
      label: 'Accession Date',
      type: 'text',
    },
    {
      name: 'accessionNumber',
      label: 'Accession Number',
      type: 'text',
      index: true,
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        disablePreview: true,
      }
    },
    {
      name: 'location',
      label: 'Location/Institution',
      type: 'text',
    },
    {
      name: 'aquisition',
      label: 'Aquisition Method',
      type: 'text',
    },
    {
      name: 'production',
      label: 'Production Technique',
      type: 'text',
    },
    {
      name: 'dimensions',
      label: 'Dimensions',
      type: 'row',
      fields: [
        {
          name: 'height',
          label: 'Height',
          type: 'text',
        },
        {
          name: 'width',
          label: 'Width',
          type: 'text',
        },
        {
          name: 'breadth',
          label: 'Breadth',
          type: 'text',
        },
        {
          name: 'length',
          label: 'Length',
          type: 'text',
        },
        {
          name: 'weight',
          label: 'Weight',
          type: 'text',
        },
        {
          name: 'circumference',
          label: 'Circumference',
          type: 'text',
        }
      ]
    },
    {
      name: 'description',
      label: 'Physical Description',
      type: 'textarea',
    },
    {
      name: 'provenance',
      label: 'Provenance',
      type: 'text',
    },
    {
      name: 'ethnicity',
      label: 'Ethnicity',
      type: 'text',
    },
    {
      name: 'geographicOrigin',
      label: 'Geographic Origin',
      type: 'text',
      index: true,
    },
    {
      name: 'identifiers',
      label: 'Identifiers',
      type: 'text',
    },
    {
      name: 'createdAt',
      label: 'Date Created',
      type: 'date',
      admin: {
        position: 'sidebar',
      }
    }
  ]
}
