import type { INodeProperties } from 'n8n-workflow';

export const conversationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['conversation'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        action: 'Create a conversation model',
        description: 'Create a new conversation model',
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete a conversation model',
        description: 'Delete a conversation model by ID',
      },
      {
        name: 'Get',
        value: 'get',
        action: 'Get a conversation model',
        description: 'Retrieve a conversation model by ID',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        action: 'Get many conversation models',
        description: 'List all conversation models',
      },
      {
        name: 'Update',
        value: 'update',
        action: 'Update a conversation model',
        description: 'Update a conversation model',
      },
    ],
    default: 'create',
  },
];

export const conversationFields: INodeProperties[] = [
  {
    displayName: 'Model ID',
    name: 'modelId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['delete', 'get', 'update'],
      },
    },
    description: 'ID of the conversation model',
  },
  {
    displayName: 'JSON Input',
    name: 'jsonInput',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['create', 'update'],
      },
    },
    description: 'Whether to provide the model configuration as raw JSON',
  },
  {
    displayName: 'Model Configuration (JSON)',
    name: 'modelJson',
    type: 'string',
    typeOptions: {
      rows: 15,
    },
    default: '',
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['create', 'update'],
        jsonInput: [true],
      },
    },
    description: 'Model configuration as JSON',
  },
  {
    displayName: 'Model Name',
    name: 'model_name',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['create'],
        jsonInput: [false],
      },
    },
    description: 'Name of the LLM model (e.g., gpt-4, claude-3)',
  },
  {
    displayName: 'Max Bytes',
    name: 'max_bytes',
    type: 'number',
    default: 16384,
    required: true,
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['create'],
        jsonInput: [false],
      },
    },
    description: 'Maximum number of bytes to send to the LLM in every API call',
  },
  {
    displayName: 'History Collection',
    name: 'history_collection',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['create'],
        jsonInput: [false],
      },
    },
    description: 'Typesense collection that stores historical conversations',
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    default: {},
    displayOptions: {
      show: {
        resource: ['conversation'],
        operation: ['create', 'update'],
        jsonInput: [false],
      },
    },
    options: [
      {
        displayName: 'Model ID',
        name: 'id',
        type: 'string',
        default: '',
        description: 'Explicit ID for the model (auto-generated if not provided)',
      },
      {
        displayName: 'API Key',
        name: 'api_key',
        type: 'string',
        typeOptions: {
          password: true,
        },
        default: '',
        description: "The LLM service's API Key",
      },
      {
        displayName: 'Account ID',
        name: 'account_id',
        type: 'string',
        default: '',
        description: "LLM service's account ID (for Cloudflare)",
      },
      {
        displayName: 'System Prompt',
        name: 'system_prompt',
        type: 'string',
        typeOptions: {
          rows: 5,
        },
        default: '',
        description: 'System prompt with special instructions to the LLM',
      },
      {
        displayName: 'TTL (Seconds)',
        name: 'ttl',
        type: 'number',
        default: 86400,
        description: 'Time interval after which messages are deleted (default: 86400 = 24 hours)',
      },
      {
        displayName: 'vLLM URL',
        name: 'vllm_url',
        type: 'string',
        default: '',
        description: 'URL of vLLM service',
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
        resource: ['conversation'],
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
        resource: ['conversation'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    description: 'Maximum number of models to retrieve',
  },
];

