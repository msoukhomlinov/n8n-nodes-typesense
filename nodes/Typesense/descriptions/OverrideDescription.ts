import type { INodeProperties } from 'n8n-workflow';

export const overrideOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['override'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        action: 'Create a search override',
        description: 'Create or update a search override',
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete a search override',
        description: 'Delete a search override by ID',
      },
      {
        name: 'Get',
        value: 'get',
        action: 'Get a search override',
        description: 'Retrieve a search override by ID',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get many search overrides',
        description: 'List all search overrides for a collection',
      },
    ],
    default: 'create',
  },
];

export const overrideFields: INodeProperties[] = [
  {
    displayName: 'Collection Name',
    name: 'collection',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['override'],
        operation: ['create', 'delete', 'get', 'getAll'],
      },
    },
    description: 'Name of the collection',
  },
  {
    displayName: 'Override ID',
    name: 'overrideId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['override'],
        operation: ['create', 'delete', 'get'],
      },
    },
    description: 'Unique identifier for the override',
  },
  {
    displayName: 'JSON Input',
    name: 'jsonInput',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['override'],
        operation: ['create'],
      },
    },
    description: 'Whether to provide the override as raw JSON',
  },
  {
    displayName: 'Override (JSON)',
    name: 'overrideJson',
    type: 'string',
    typeOptions: {
      rows: 15,
    },
    default: '',
    displayOptions: {
      show: {
        resource: ['override'],
        operation: ['create'],
        jsonInput: [true],
      },
    },
    description: 'Override configuration as JSON',
  },
  {
    displayName: 'Rule',
    name: 'rule',
    type: 'fixedCollection',
    default: {},
    required: true,
    displayOptions: {
      show: {
        resource: ['override'],
        operation: ['create'],
        jsonInput: [false],
      },
    },
    description: 'Rule that triggers the override',
    options: [
      {
        name: 'ruleValues',
        displayName: 'Rule',
        values: [
          {
            displayName: 'Query',
            name: 'query',
            type: 'string',
            default: '',
            required: true,
            description: 'Search query that should trigger this override',
          },
          {
            displayName: 'Match Type',
            name: 'match',
            type: 'options',
            options: [
              { name: 'Exact', value: 'exact' },
              { name: 'Contains', value: 'contains' },
            ],
            default: 'exact',
            description: 'Whether to match the query exactly or if it contains the term',
          },
        ],
      },
    ],
  },
  {
    displayName: 'Includes',
    name: 'includes',
    type: 'fixedCollection',
    default: [],
    typeOptions: {
      multipleValues: true,
    },
    displayOptions: {
      show: {
        resource: ['override'],
        operation: ['create'],
        jsonInput: [false],
      },
    },
    description: 'Documents to include in search results',
    options: [
      {
        name: 'include',
        displayName: 'Include',
        values: [
          {
            displayName: 'Document ID',
            name: 'id',
            type: 'string',
            default: '',
            required: true,
            description: 'ID of the document to include',
          },
          {
            displayName: 'Position',
            name: 'position',
            type: 'number',
            default: 1,
            required: true,
            description: 'Position where the document should appear',
          },
        ],
      },
    ],
  },
  {
    displayName: 'Excludes',
    name: 'excludes',
    type: 'fixedCollection',
    default: [],
    typeOptions: {
      multipleValues: true,
    },
    displayOptions: {
      show: {
        resource: ['override'],
        operation: ['create'],
        jsonInput: [false],
      },
    },
    description: 'Documents to exclude from search results',
    options: [
      {
        name: 'exclude',
        displayName: 'Exclude',
        values: [
          {
            displayName: 'Document ID',
            name: 'id',
            type: 'string',
            default: '',
            required: true,
            description: 'ID of the document to exclude',
          },
        ],
      },
    ],
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    default: {},
    displayOptions: {
      show: {
        resource: ['override'],
        operation: ['create'],
        jsonInput: [false],
      },
    },
    options: [
      {
        displayName: 'Filter By',
        name: 'filter_by',
        type: 'string',
        default: '',
        description: 'Filter clause applied to matching queries',
      },
      {
        displayName: 'Sort By',
        name: 'sort_by',
        type: 'string',
        default: '',
        description: 'Sort clause applied to matching queries',
      },
      {
        displayName: 'Replace Query',
        name: 'replace_query',
        type: 'string',
        default: '',
        description: 'Replace the search query with this value',
      },
      {
        displayName: 'Remove Matched Tokens',
        name: 'remove_matched_tokens',
        type: 'boolean',
        default: false,
        description: 'Whether to remove matched tokens from the query',
      },
      {
        displayName: 'Filter Curated Hits',
        name: 'filter_curated_hits',
        type: 'boolean',
        default: false,
        description: 'Whether to apply filter conditions to curated records',
      },
      {
        displayName: 'Metadata (JSON)',
        name: 'metadata',
        type: 'string',
        default: '',
        description: 'Custom JSON metadata to return when this rule is triggered',
      },
      {
        displayName: 'Effective From (Unix Timestamp)',
        name: 'effective_from_ts',
        type: 'number',
        default: 0,
        description: 'Unix timestamp when the override becomes active',
      },
      {
        displayName: 'Effective To (Unix Timestamp)',
        name: 'effective_to_ts',
        type: 'number',
        default: 0,
        description: 'Unix timestamp when the override expires',
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
        resource: ['override'],
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
        resource: ['override'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    description: 'Maximum number of overrides to retrieve',
  },
];

