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
    displayName: 'Synonym Set Name',
    name: 'synonymSetName',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['synonym'],
        operation: ['create', 'delete', 'get'],
      },
    },
    description: 'Name of the synonym set to operate on',
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
      'Synonym set as JSON. Must include "items" array with objects containing "id" and "synonyms" fields.',
  },
  {
    displayName: 'Synonym Items',
    name: 'synonymItems',
    type: 'fixedCollection',
    default: [],
    typeOptions: {
      multipleValues: true,
    },
    displayOptions: {
      show: {
        resource: ['synonym'],
        operation: ['create'],
        jsonInput: [false],
      },
    },
    description: 'Array of synonym items',
    options: [
      {
        name: 'item',
        displayName: 'Item',
        values: [
          {
            displayName: 'ID',
            name: 'id',
            type: 'string',
            default: '',
            required: true,
            description: 'Unique identifier for the synonym item',
          },
          {
            displayName: 'Synonyms',
            name: 'synonyms',
            type: 'string',
            default: '',
            required: true,
            description: 'Comma-separated list of words that should be considered as synonyms',
          },
          {
            displayName: 'Root',
            name: 'root',
            type: 'string',
            default: '',
            description: 'For 1-way synonyms, the root word that synonyms map to',
          },
          {
            displayName: 'Locale',
            name: 'locale',
            type: 'string',
            default: '',
            description: 'Locale for the synonym (leave blank for standard tokenizer)',
          },
        ],
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
