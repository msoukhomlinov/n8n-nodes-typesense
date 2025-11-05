import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { NodeApiError, NodeOperationError, jsonParse } from 'n8n-workflow';

import { BaseTypesenseResource } from './BaseTypesenseResource';
import { getTypesenseClient } from '../GenericFunctions';

export class ConversationResource extends BaseTypesenseResource {
  constructor() {
    super('conversation');
  }

  getOperations(): INodeProperties[] {
    return [
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
  }

  getFields(): INodeProperties[] {
    return [
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
  }

  async execute(
    operation: string,
    context: IExecuteFunctions,
    itemIndex: number,
  ): Promise<IDataObject | IDataObject[]> {
    const client = await getTypesenseClient.call(context);

    try {
      switch (operation) {
        case 'create':
          return await this.createModel(context, client, itemIndex);

        case 'delete':
          return await this.deleteModel(context, client, itemIndex);

        case 'get':
          return await this.getModel(context, client, itemIndex);

        case 'getAll':
          return await this.getAllModels(context, client, itemIndex);

        case 'update':
          return await this.updateModel(context, client, itemIndex);

        default:
          throw new NodeOperationError(
            context.getNode(),
            `The operation "${operation}" is not supported for ${this.resourceName}.`,
            { itemIndex },
          );
      }
    } catch (error) {
      if (context.continueOnFail()) {
        return { error: (error as Error).message };
      }
      throw new NodeApiError(context.getNode(), error as any, { itemIndex });
    }
  }

  private async createModel(
    context: IExecuteFunctions,
    client: any,
    itemIndex: number,
  ): Promise<IDataObject> {
    const useJson = this.getBoolean(context, 'jsonInput', itemIndex);

    let modelData: IDataObject;

    if (useJson) {
      const modelJson = this.validateRequired(context, 'modelJson', itemIndex);
      try {
        modelData = jsonParse<IDataObject>(modelJson);
      } catch (error) {
        throw new NodeOperationError(context.getNode(), 'Model JSON must be valid JSON.', {
          itemIndex,
        });
      }
    } else {
      const modelName = this.validateRequired(context, 'model_name', itemIndex);
      const maxBytes = this.validateRequired(context, 'max_bytes', itemIndex);
      const historyCollection = this.validateRequired(context, 'history_collection', itemIndex);

      modelData = {
        model_name: modelName,
        max_bytes: maxBytes,
        history_collection: historyCollection,
      };

      const additionalOptions = this.getObject(context, 'additionalOptions', itemIndex);
      if (additionalOptions) {
        Object.entries(additionalOptions).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            modelData[key] = value;
          }
        });
      }
    }

    const response = await client.conversations().models().create(modelData);
    return response as IDataObject;
  }

  private async deleteModel(
    context: IExecuteFunctions,
    client: any,
    itemIndex: number,
  ): Promise<IDataObject> {
    const modelId = this.validateRequired(context, 'modelId', itemIndex);
    const response = await client.conversations().models(modelId).delete();
    return response as IDataObject;
  }

  private async getModel(
    context: IExecuteFunctions,
    client: any,
    itemIndex: number,
  ): Promise<IDataObject> {
    const modelId = this.validateRequired(context, 'modelId', itemIndex);
    const response = await client.conversations().models(modelId).retrieve();
    const result = response as IDataObject;
    const filterColumns = this.getOptional(context, 'filterColumns', itemIndex) as string | undefined;
    return this.filterColumns(result, filterColumns) as IDataObject;
  }

  private async getAllModels(
    context: IExecuteFunctions,
    client: any,
    itemIndex: number,
  ): Promise<IDataObject[]> {
    const returnAll = this.getBoolean(context, 'returnAll', itemIndex, true);
    const limit = this.getNumber(context, 'limit', itemIndex, 50);

    const response = await client.conversations().models().retrieve();
    
    // API returns an array directly
    const models = Array.isArray(response) ? response : [response];

    let result: IDataObject[];
    if (returnAll) {
      result = models as IDataObject[];
    } else {
      result = models.slice(0, limit) as IDataObject[];
    }

    const filterColumns = this.getOptional(context, 'filterColumns', itemIndex) as string | undefined;
    return this.filterColumns(result, filterColumns) as IDataObject[];
  }

  private async updateModel(
    context: IExecuteFunctions,
    client: any,
    itemIndex: number,
  ): Promise<IDataObject> {
    const modelId = this.validateRequired(context, 'modelId', itemIndex);
    const useJson = this.getBoolean(context, 'jsonInput', itemIndex);

    let modelData: IDataObject;

    if (useJson) {
      const modelJson = this.validateRequired(context, 'modelJson', itemIndex);
      try {
        modelData = jsonParse<IDataObject>(modelJson);
      } catch (error) {
        throw new NodeOperationError(context.getNode(), 'Model JSON must be valid JSON.', {
          itemIndex,
        });
      }
    } else {
      modelData = {};

      const additionalOptions = this.getObject(context, 'additionalOptions', itemIndex);
      if (additionalOptions) {
        Object.entries(additionalOptions).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            modelData[key] = value;
          }
        });
      }

      if (Object.keys(modelData).length === 0) {
        throw new NodeOperationError(
          context.getNode(),
          'Please provide at least one field to update.',
          { itemIndex },
        );
      }
    }

    const response = await client.conversations().models(modelId).update(modelData);
    return response as IDataObject;
  }
}

