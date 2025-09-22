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
    ],
    default: 'create',
  },
];

export const documentFields: INodeProperties[] = [
  {
    displayName: 'Collection Name',
    name: 'collection',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['create', 'delete', 'get', 'getAll', 'update', 'search', 'deleteByQuery'],
      },
    },
    description: 'Name of the collection to operate on',
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
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['search'],
      },
    },
    description: 'Comma-separated list of fields to search in',
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
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['search', 'getAll'],
      },
    },
    description: 'Sort expression (e.g., num_employees:desc)',
  },
  {
    displayName: 'Facet By',
    name: 'facetBy',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['search'],
      },
    },
    description: 'Comma-separated list of fields to facet by',
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
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['search', 'getAll'],
      },
    },
    description: 'Comma-separated list of fields to include in results',
  },
  {
    displayName: 'Exclude Fields',
    name: 'excludeFields',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['document'],
        operation: ['search', 'getAll'],
      },
    },
    description: 'Comma-separated list of fields to exclude from results',
  },
];
