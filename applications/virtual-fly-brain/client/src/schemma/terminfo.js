export const terminfoSchemma = {
  type: 'object',
  required: ['Name', 'Id', 'SuperTypes', 'Meta', 'Tags'],
  properties: {
    Name: { type: 'string' },
    Id: { type: 'string' },
    SuperTypes: {
      type: 'array',
      items: { type: 'string' },
    },
    Meta: {
      type: 'object',
      additionalProperties: { type: 'string' },
    },
    Tags: {
      type: 'array',
      items: { type: 'string' },
    },
    Queries: { type: 'object' },
    IsIndividual: { type: 'boolean', default: false },
    Images: {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'label'],
          properties: {
            id: { type: 'string' },
            label: { type: 'string' },
            thumbnail: { type: ['string', 'null'] },
            thumbnail_transparent: { type: ['string', 'null'] },
            nrrd: { type: ['string', 'null'] },
            wlz: { type: ['string', 'null'] },
            obj: { type: ['string', 'null'] },
            swc: { type: ['string', 'null'] },
            index: { type: ['integer', 'null'] },
            center: { type: ['object', 'null'] },
            extent: { type: ['object', 'null'] },
            voxel: { type: ['object', 'null'] },
            orientation: { type: ['string', 'null'] },
            type_label: { type: ['string', 'null'] },
            type_id: { type: ['string', 'null'] },
          },
        },
      },
    },
    IsClass: { type: 'boolean', default: false },
    Examples: {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'label'],
          properties: {
            id: { type: 'string' },
            label: { type: 'string' },
            thumbnail: { type: ['string', 'null'] },
            thumbnail_transparent: { type: ['string', 'null'] },
            nrrd: { type: ['string', 'null'] },
            wlz: { type: ['string', 'null'] },
            obj: { type: ['string', 'null'] },
            swc: { type: ['string', 'null'] },
            index: { type: ['integer', 'null'] },
            center: { type: ['object', 'null'] },
            extent: { type: ['object', 'null'] },
            voxel: { type: ['object', 'null'] },
            orientation: { type: ['string', 'null'] },
            type_label: { type: ['string', 'null'] },
            type_id: { type: ['string', 'null'] },
          },
        },
      },
    },
    IsTemplate: { type: 'boolean', default: false },
    Domains: {
      type: ['object', 'null'],
      additionalProperties: {
        type: 'object',
        required: ['id', 'label'],
        properties: {
          id: { type: 'string' },
          label: { type: 'string' },
          thumbnail: { type: ['string', 'null'],
          thumbnail_transparent: { type: ['string', 'null'] },
          nrrd: { type: ['string', 'null'] },
          wlz: { type: ['string', 'null'] },
          obj: { type: ['string', 'null'] },
          swc: { type: ['string', 'null'] },
          index: { type: ['integer', 'null'] },
          center: { type: ['object', 'null'] },
          extent: { type: ['object', 'null'] },
          voxel: { type: ['object', 'null'] },
          orientation: { type: ['string', 'null'] },
          type_label: { type: ['string', 'null'] },
          type_id: { type: ['string', 'null'] },
          }       
        }
      }
    },
  IsTemplate: { type: 'boolean', default: false },
    Domains: {
      type: ['object', 'null'],
      additionalProperties: {
        type: 'object',
        required: ['id', 'label'],
        properties: {
          id: { type: 'string' },
          label: { type: 'string' },
          thumbnail: { type: ['string', 'null'] },
          thumbnail_transparent: { type: ['string', 'null'] },
          nrrd: { type: ['string', 'null'] },
          wlz: { type: ['string', 'null'] },
          obj: { type: ['string', 'null'] },
          swc: { type: ['string', 'null'] },
          index: { type: ['integer', 'null'] },
          center: { type: ['object', 'null'] },
          extent: { type: ['object', 'null'] },
          voxel: { type: ['object', 'null'] },
          orientation: { type: ['string', 'null'] },
          type_label: { type: ['string', 'null'] },
          type_id: { type: ['string', 'null'] },
        },
      },
    }
  }
}