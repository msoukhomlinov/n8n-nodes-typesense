import type { INodeProperties } from 'n8n-workflow';

const fieldTypeOptions = [
  { name: 'String', value: 'string' },
  { name: 'String (Auto-facet)', value: 'string*' },
  { name: 'Int 32', value: 'int32' },
  { name: 'Int 64', value: 'int64' },
  { name: 'Float', value: 'float' },
  { name: 'Bool', value: 'bool' },
  { name: 'Geo Point', value: 'geopoint' },
  { name: 'String Array', value: 'string[]' },
  { name: 'Int 32 Array', value: 'int32[]' },
  { name: 'Float Array', value: 'float[]' },
  { name: 'Bool Array', value: 'bool[]' },
  { name: 'Object', value: 'object' },
  { name: 'Auto', value: 'auto' },
  { name: 'Image', value: 'image' },
];

export const collectionOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['collection'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        action: 'Create a collection',
        description: 'Create a new collection',
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete a collection',
        description: 'Delete an existing collection',
      },
      {
        name: 'Get',
        value: 'get',
        action: 'Get a collection',
        description: 'Retrieve a collection by name',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get many collections',
        description: 'List all collections',
      },
      {
        name: 'Update',
        value: 'update',
        action: 'Update a collection',
        description: 'Update a collection schema',
      },
    ],
    default: 'create',
  },
];

export const collectionFields: INodeProperties[] = [
  {
    displayName: 'Collection Name',
    name: 'collectionId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['collection'],
        operation: ['delete', 'get', 'update'],
      },
    },
    description: 'Name of the collection to operate on',
  },
  {
    displayName: 'JSON Parameters',
    name: 'jsonParameters',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['collection'],
        operation: ['create', 'update'],
      },
    },
    description: 'Whether to provide the schema as raw JSON',
  },
  {
    displayName: 'Collection Schema (JSON)',
    name: 'schemaJson',
    type: 'string',
    typeOptions: {
      rows: 6,
    },
    default: '',
    displayOptions: {
      show: {
        resource: ['collection'],
        operation: ['create', 'update'],
        jsonParameters: [true],
      },
    },
    description: 'JSON representation of the collection schema',
  },
  {
    displayName: 'Collection Schema',
    name: 'schemaParameters',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['collection'],
        operation: ['create'],
        jsonParameters: [false],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        required: false,
      },
      {
        displayName: 'Enable Nested Fields',
        name: 'enableNestedFields',
        type: 'boolean',
        default: false,
        description: 'Allow nested object fields in the collection schema',
      },
      {
        displayName: 'Fields',
        name: 'fields',
        type: 'fixedCollection',
        default: [],
        typeOptions: {
          multipleValues: true,
        },
        options: [
          {
            name: 'field',
            displayName: 'Field',
            values: [
              {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                required: false,
              },
              {
                displayName: 'Type',
                name: 'type',
                type: 'options',
                options: fieldTypeOptions,
                default: 'string',
                required: true,
              },
              {
                displayName: 'Facet',
                name: 'facet',
                type: 'boolean',
                default: false,
                description: 'Whether the field should be faceted',
              },
              {
                displayName: 'Optional',
                name: 'optional',
                type: 'boolean',
                default: false,
                description: 'Whether the field is optional',
              },
              {
                displayName: 'Sort',
                name: 'sort',
                type: 'boolean',
                default: false,
                description: 'Whether the field can be used for sorting',
              },
              {
                displayName: 'Infix Search',
                name: 'infix',
                type: 'boolean',
                default: false,
                description: 'Enable infix (contains) searches on this field',
              },
              {
                displayName: 'Index',
                name: 'index',
                type: 'boolean',
                default: true,
                description: 'Whether the field should be indexed',
              },
              {
                displayName: 'Locale',
                name: 'locale',
                type: 'string',
                default: '',
                description: 'Locale to use for string fields',
              },
              {
                displayName: 'Number of Dimensions',
                name: 'numDim',
                type: 'number',
                default: 0,
                typeOptions: {
                  minValue: 0,
                },
                description: 'Number of dimensions for vector fields',
              },
              {
                displayName: 'Reference',
                name: 'reference',
                type: 'string',
                default: '',
                description: 'Name of a field in another collection for joins',
              },
              {
                displayName: 'Drop',
                name: 'drop',
                type: 'boolean',
                default: false,
                description: 'Drop this field from indexing',
              },
              {
                displayName: 'Store',
                name: 'store',
                type: 'boolean',
                default: true,
                description: 'Store field value on disk',
              },
              {
                displayName: 'Vector Distance',
                name: 'vecDist',
                type: 'options',
                options: [
                  { name: 'Cosine', value: 'cosine' },
                  { name: 'Inner Product', value: 'ip' },
                ],
                default: 'cosine',
                description: 'Distance metric for vector search',
              },
              {
                displayName: 'Range Index',
                name: 'rangeIndex',
                type: 'boolean',
                default: false,
                description: 'Enable range filtering optimization',
              },
              {
                displayName: 'Stem',
                name: 'stem',
                type: 'boolean',
                default: false,
                description: 'Enable stemming for this field',
              },
              {
                displayName: 'Stem Dictionary',
                name: 'stemDictionary',
                type: 'string',
                default: '',
                description: 'Name of stemming dictionary to use',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    displayName: 'Additional Options',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['collection'],
        operation: ['create'],
        jsonParameters: [false],
      },
    },
    options: [
      {
        displayName: 'Default Sorting Field',
        name: 'defaultSortingField',
        type: 'string',
        default: '',
        description: 'Field to use for default sorting operations',
      },
      {
        displayName: 'Token Separators',
        name: 'tokenSeparators',
        type: 'string',
        default: '',
        description: 'Comma-separated list of token separator characters',
      },
      {
        displayName: 'Symbols to Index',
        name: 'symbolsToIndex',
        type: 'string',
        default: '',
        description: 'Comma-separated list of symbols to include in the index',
      },
        {
          displayName: 'Metadata (JSON)',
          name: 'metadataJson',
          type: 'string',
          typeOptions: {
            rows: 3,
          },
          default: '',
          description: 'Optional metadata to store with the collection schema',
        },
        {
          displayName: 'Synonym Sets',
          name: 'synonymSets',
          type: 'string',
          default: '',
          description: 'Comma-separated list of synonym set names to associate with this collection',
        },
        {
          displayName: 'Voice Query Model (JSON)',
          name: 'voiceQueryModelJson',
          type: 'string',
          typeOptions: {
            rows: 4,
          },
          default: '',
          description: 'Voice query model configuration as JSON',
        },
    ],
  },
  {
    displayName: 'Collection Schema',
    name: 'updateSchemaParameters',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['collection'],
        operation: ['update'],
        jsonParameters: [false],
      },
    },
    options: [
      {
        displayName: 'Enable Nested Fields',
        name: 'enableNestedFields',
        type: 'boolean',
        default: false,
        description: 'Allow nested object fields in the collection schema',
      },
      {
        displayName: 'Fields',
        name: 'fields',
        type: 'fixedCollection',
        default: [],
        typeOptions: {
          multipleValues: true,
        },
        options: [
          {
            name: 'field',
            displayName: 'Field',
            values: [
              {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                required: true,
              },
              {
                displayName: 'Type',
                name: 'type',
                type: 'options',
                options: fieldTypeOptions,
                default: 'string',
                required: true,
              },
              {
                displayName: 'Facet',
                name: 'facet',
                type: 'boolean',
                default: false,
              },
              {
                displayName: 'Optional',
                name: 'optional',
                type: 'boolean',
                default: false,
              },
              {
                displayName: 'Sort',
                name: 'sort',
                type: 'boolean',
                default: false,
              },
              {
                displayName: 'Infix Search',
                name: 'infix',
                type: 'boolean',
                default: false,
              },
              {
                displayName: 'Index',
                name: 'index',
                type: 'boolean',
                default: true,
              },
              {
                displayName: 'Locale',
                name: 'locale',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Number of Dimensions',
                name: 'numDim',
                type: 'number',
                default: 0,
                typeOptions: {
                  minValue: 0,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    displayName: 'Additional Options',
    name: 'updateAdditionalFields',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['collection'],
        operation: ['update'],
        jsonParameters: [false],
      },
    },
    options: [
      {
        displayName: 'Default Sorting Field',
        name: 'defaultSortingField',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Token Separators',
        name: 'tokenSeparators',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Symbols to Index',
        name: 'symbolsToIndex',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Metadata (JSON)',
        name: 'metadataJson',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
      },
    ],
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: true,
    displayOptions: {
      show: {
        resource: ['collection'],
        operation: ['getAll'],
      },
    },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    typeOptions: {
      minValue: 1,
      maxValue: 200,
    },
    displayOptions: {
      show: {
        resource: ['collection'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    description: 'Maximum number of collections to retrieve',
  },
  {
    displayName: 'Exclude Fields',
    name: 'excludeFields',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['collection'],
        operation: ['getAll'],
      },
    },
    description: 'Comma-separated list of fields to exclude from the response',
  },
  {
    displayName: 'Offset',
    name: 'offset',
    type: 'number',
    default: 0,
    typeOptions: {
      minValue: 0,
    },
    displayOptions: {
      show: {
        resource: ['collection'],
        operation: ['getAll'],
      },
    },
    description: 'Starting point for pagination',
  },
];
