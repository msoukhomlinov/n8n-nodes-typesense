import type { INodeProperties } from 'n8n-workflow';

export const documentOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['document'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        action: 'Create a document',
        description: 'Create a new document in a collection',
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete a document',
        description: 'Delete a document by ID',
      },
      {
        name: 'Get',
        value: 'get',
        action: 'Get a document',
        description: 'Retrieve a document by ID',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get many documents',
        description: 'List documents in a collection',
      },
      {
        name: 'Update',
        value: 'update',
        action: 'Update a document',
        description: 'Update a document by ID',
      },
      {
        name: 'Search',
        value: 'search',
        action: 'Search documents',
        description: 'Search for documents in a collection',
      },
      {
        name: 'Delete by Query',
        value: 'deleteByQuery',
        action: 'Delete documents by query',
        description: 'Delete documents matching a query',
      },
      {
        name: 'Import',
        value: 'import',
        action: 'Import documents',
        description: 'Import documents from JSONL format',
      },
      {
        name: 'Export',
        value: 'export',
        action: 'Export documents',
        description: 'Export documents to JSONL format',
      },
    ],
    default: 'create',
  },
];

export const documentFields: INodeProperties[] = [
  {
    displayName: 'Collection Name',
    name: 'collection',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getCollections',
    },
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['create', 'delete', 'get', 'getAll', 'update', 'search', 'deleteByQuery', 'import', 'export'],
      },
    },
    description: 'Select a collection from your Typesense instance',
  },
  {
    displayName: 'Document ID',
    name: 'documentId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['delete', 'get', 'update'],
      },
    },
    description: 'ID of the document to operate on',
  },
  {
    displayName: 'JSON Input',
    name: 'jsonInput',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['create', 'update'],
      },
    },
    description: 'Whether to provide the document data as raw JSON',
  },
  {
    displayName: 'Document Data (JSON)',
    name: 'documentJson',
    type: 'string',
    typeOptions: {
      rows: 8,
    },
    default: '',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['create', 'update'],
        jsonInput: [true],
      },
    },
    description: 'JSON representation of the document data',
  },
  {
    displayName: 'Document Fields',
    name: 'documentFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['create', 'update'],
        jsonInput: [false],
      },
    },
    options: [
      {
        displayName: 'Field Name',
        name: 'fieldName',
        type: 'string',
        default: '',
        description: 'Name of the field',
      },
      {
        displayName: 'Field Value',
        name: 'fieldValue',
        type: 'string',
        default: '',
        description: 'Value of the field (will be parsed as JSON)',
      },
    ],
  },
  {
    displayName: 'Search Query',
    name: 'query',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['search', 'deleteByQuery'],
      },
    },
    description: 'Search query text',
  },
  {
    displayName: 'Query By',
    name: 'queryBy',
    type: 'multiOptions',
    typeOptions: {
      loadOptionsMethod: 'getFieldNames',
      loadOptionsDependsOn: ['collection'],
    },
    default: [],
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['search'],
      },
    },
    description: 'Fields to search in. Select multiple fields from your collection schema.',
  },
  {
    displayName: 'Filter By',
    name: 'filterBy',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['search', 'getAll', 'deleteByQuery'],
      },
    },
    description: 'Filter expression (e.g., num_employees:>100)',
  },
  {
    displayName: 'Sort By',
    name: 'sortBy',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getFieldNames',
      loadOptionsDependsOn: ['collection'],
    },
    default: '',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['search', 'getAll'],
      },
    },
    description: 'Field to sort by. Add :asc or :desc after selecting (e.g., num_employees:desc).',
    hint: 'You can manually add :asc or :desc to the field name',
  },
  {
    displayName: 'Facet By',
    name: 'facetBy',
    type: 'multiOptions',
    typeOptions: {
      loadOptionsMethod: 'getFieldNames',
      loadOptionsDependsOn: ['collection'],
    },
    default: [],
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['search'],
      },
    },
    description: 'Fields to facet by. Select multiple fields from your collection schema.',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: true,
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['getAll', 'search'],
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
        resource: ['document'],
        operation: ['getAll', 'search'],
        returnAll: [false],
      },
    },
    description: 'Maximum number of documents to retrieve',
  },
  {
    displayName: 'Page',
    name: 'page',
    type: 'number',
    default: 1,
    typeOptions: {
      minValue: 1,
    },
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['search'],
      },
    },
    description: 'Page number for pagination',
  },
  {
    displayName: 'Include Fields',
    name: 'includeFields',
    type: 'multiOptions',
    typeOptions: {
      loadOptionsMethod: 'getFieldNames',
      loadOptionsDependsOn: ['collection'],
    },
    default: [],
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['search', 'getAll'],
      },
    },
    description: 'Fields to include in results. Leave empty to include all fields.',
  },
  {
    displayName: 'Exclude Fields',
    name: 'excludeFields',
    type: 'multiOptions',
    typeOptions: {
      loadOptionsMethod: 'getFieldNames',
      loadOptionsDependsOn: ['collection'],
    },
    default: [],
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['search', 'getAll'],
      },
    },
    description: 'Fields to exclude from results',
  },
  {
    displayName: 'Documents Data (JSONL)',
    name: 'documentsJsonl',
    type: 'string',
    typeOptions: {
      rows: 10,
    },
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['import'],
      },
    },
    description:
      'Documents in JSONL format (newline-delimited JSON). Each line should be a valid JSON document.',
  },
  {
    displayName: 'Import Parameters',
    name: 'importParameters',
    type: 'collection',
    placeholder: 'Add Parameter',
    default: {},
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['import'],
      },
    },
    options: [
      {
        displayName: 'Batch Size',
        name: 'batchSize',
        type: 'number',
        default: 40,
        typeOptions: {
          minValue: 1,
        },
        description: 'Number of documents to import in each batch',
      },
      {
        displayName: 'Return ID',
        name: 'returnId',
        type: 'boolean',
        default: false,
        description: 'Return the ID of imported documents in the response',
      },
      {
        displayName: 'Return Document',
        name: 'returnDoc',
        type: 'boolean',
        default: false,
        description: 'Return the imported document in the response',
      },
      {
        displayName: 'Action',
        name: 'action',
        type: 'options',
        options: [
          { name: 'Create', value: 'create' },
          { name: 'Update', value: 'update' },
          { name: 'Upsert', value: 'upsert' },
          { name: 'Emplace', value: 'emplace' },
        ],
        default: 'create',
        description: 'Action to perform on documents',
      },
      {
        displayName: 'Dirty Values',
        name: 'dirtyValues',
        type: 'options',
        options: [
          { name: 'Coerce or Reject', value: 'coerce_or_reject' },
          { name: 'Coerce or Drop', value: 'coerce_or_drop' },
          { name: 'Drop', value: 'drop' },
          { name: 'Reject', value: 'reject' },
        ],
        default: 'coerce_or_reject',
        description: 'How to handle values that do not match the schema',
      },
      {
        displayName: 'Remote Embedding Batch Size',
        name: 'remoteEmbeddingBatchSize',
        type: 'number',
        default: 10,
        typeOptions: {
          minValue: 1,
        },
        description: 'Batch size for remote embedding generation',
      },
    ],
  },
  {
    displayName: 'Export Parameters',
    name: 'exportParameters',
    type: 'collection',
    placeholder: 'Add Parameter',
    default: {},
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['export'],
      },
    },
    options: [
      {
        displayName: 'Filter By',
        name: 'filterBy',
        type: 'string',
        default: '',
        description: 'Filter expression (e.g., num_employees:>100)',
      },
      {
        displayName: 'Include Fields',
        name: 'includeFields',
        type: 'string',
        default: '',
        description: 'Comma-separated list of fields to include in export',
      },
      {
        displayName: 'Exclude Fields',
        name: 'excludeFields',
        type: 'string',
        default: '',
        description: 'Comma-separated list of fields to exclude from export',
      },
    ],
  },
];
