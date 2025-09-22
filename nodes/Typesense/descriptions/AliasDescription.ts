import type { INodeProperties } from 'n8n-workflow';

export const aliasOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['alias'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        action: 'Create an alias',
        description: 'Create a new collection alias',
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete an alias',
        description: 'Delete a collection alias',
      },
      {
        name: 'Get',
        value: 'get',
        action: 'Get an alias',
        description: 'Retrieve an alias configuration',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get many aliases',
        description: 'List all collection aliases',
      },
      {
        name: 'Update',
        value: 'update',
        action: 'Update an alias',
        description: 'Update an alias to point to a different collection',
      },
    ],
    default: 'create',
  },
];

export const aliasFields: INodeProperties[] = [
  {
    displayName: 'Alias Name',
    name: 'aliasName',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['alias'],
        operation: ['create', 'delete', 'get', 'update'],
      },
    },
    description: 'Name of the alias to operate on',
  },
  {
    displayName: 'Collection Name',
    name: 'collectionName',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['alias'],
        operation: ['create', 'update'],
      },
    },
    description: 'Name of the collection the alias should point to',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: true,
    displayOptions: {
      show: {
        resource: ['alias'],
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
        resource: ['alias'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    description: 'Maximum number of aliases to retrieve',
  },
];
