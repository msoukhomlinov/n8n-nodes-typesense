import type { INodeProperties } from 'n8n-workflow';

export const synonymOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['synonym'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        action: 'Create a synonym set',
        description: 'Create or update a synonym set',
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete a synonym set',
        description: 'Delete a synonym set by name',
      },
      {
        name: 'Get',
        value: 'get',
        action: 'Get a synonym set',
        description: 'Retrieve a synonym set by name',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get many synonym sets',
        description: 'List all synonym sets',
      },
    ],
    default: 'create',
  },
];

export const synonymFields: INodeProperties[] = [
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
        resource: ['synonym'],
        operation: ['create', 'delete', 'get', 'getAll'],
      },
    },
    description: 'Select a collection from your Typesense instance',
  },
  {
    displayName: 'Synonym Set Name',
    name: 'synonymSetName',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getSynonymSets',
      loadOptionsDependsOn: ['collection'],
    },
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['synonym'],
        operation: ['delete', 'get'],
      },
    },
    description: 'Select an existing synonym set',
  },
  {
    displayName: 'Synonym Set Name',
    name: 'synonymSetName',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['synonym'],
        operation: ['create'],
      },
    },
    description: 'Name for the new synonym set',
  },
  {
    displayName: 'JSON Input',
    name: 'jsonInput',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['synonym'],
        operation: ['create'],
      },
    },
    description: 'Whether to provide the synonym set as raw JSON',
  },
  {
    displayName: 'Synonym Set (JSON)',
    name: 'synonymSetJson',
    type: 'string',
    typeOptions: {
      rows: 10,
    },
    default: '',
    displayOptions: {
      show: {
        resource: ['synonym'],
        operation: ['create'],
        jsonInput: [true],
      },
    },
    description:
      'Synonym set as JSON. Example: {"synonyms": ["blazer", "coat", "jacket"]} or {"root": "smart phone", "synonyms": ["iphone", "android"]}',
  },
  {
    displayName: 'Synonyms',
    name: 'synonyms',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['synonym'],
        operation: ['create'],
        jsonInput: [false],
      },
    },
    description: 'Comma-separated list of words to be treated as synonyms (multi-way).',
    placeholder: 'Microsoft 365, M365, Office 365',
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    default: {},
    displayOptions: {
      show: {
        resource: ['synonym'],
        operation: ['create'],
        jsonInput: [false],
      },
    },
    options: [
      {
        displayName: 'Root',
        name: 'root',
        type: 'string',
        default: '',
        description: 'For one-way synonyms, the query term that should expand to the values in Synonyms. Example: root "smart phone" with synonyms "iphone, android" makes "smart phone" match docs with "iphone" or "android" (not vice versa).',
        placeholder: 'smart phone',
      },
      {
        displayName: 'Locale',
        name: 'locale',
        type: 'string',
        default: '',
        description: 'Locale for tokenization and matching (leave blank for global application).',
        placeholder: 'en',
      },
          {
            displayName: 'Symbols to Index',
            name: 'symbols_to_index',
            type: 'string',
            default: '',
            description:
              'Comma-separated special characters to index as-is (by default, special characters are dropped). Example: +, &, @',
            placeholder: '+, &, @',
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
        resource: ['synonym'],
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
        resource: ['synonym'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    description: 'Maximum number of synonym sets to retrieve',
  },
];
