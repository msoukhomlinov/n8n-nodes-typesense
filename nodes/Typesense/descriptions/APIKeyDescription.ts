import type { INodeProperties } from 'n8n-workflow';

export const apiKeyOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['apiKey'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        action: 'Create an API key',
        description: 'Create a new API key with specified permissions',
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete an API key',
        description: 'Delete an API key by ID',
      },
      {
        name: 'Get',
        value: 'get',
        action: 'Get an API key',
        description: 'Retrieve an API key by ID',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get many API keys',
        description: 'List all API keys',
      },
    ],
    default: 'create',
  },
];

export const apiKeyFields: INodeProperties[] = [
  {
    displayName: 'API Key ID',
    name: 'apiKeyId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['apiKey'],
        operation: ['delete', 'get'],
      },
    },
    description: 'ID of the API key to operate on',
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['apiKey'],
        operation: ['create'],
      },
    },
    description: 'Description for the API key',
  },
  {
    displayName: 'Actions',
    name: 'actions',
    type: 'multiOptions',
    options: [
      { name: 'Search Documents', value: 'documents:search' },
      { name: 'Create Documents', value: 'documents:create' },
      { name: 'Update Documents', value: 'documents:update' },
      { name: 'Delete Documents', value: 'documents:delete' },
      { name: 'Manage Collections', value: 'collections:manage' },
    ],
    default: ['documents:search'],
    required: true,
    displayOptions: {
      show: {
        resource: ['apiKey'],
        operation: ['create'],
      },
    },
    description: 'Actions the API key is allowed to perform',
  },
  {
    displayName: 'Collections',
    name: 'collections',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['apiKey'],
        operation: ['create'],
      },
    },
    description: 'Comma-separated list of collection names the API key can access (leave empty for all)',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: true,
    displayOptions: {
      show: {
        resource: ['apiKey'],
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
        resource: ['apiKey'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    description: 'Maximum number of API keys to retrieve',
  },
];
