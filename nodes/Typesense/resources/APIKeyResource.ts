import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { NodeApiError, NodeOperationError, jsonParse } from 'n8n-workflow';

import { BaseTypesenseResource } from './BaseTypesenseResource';
import { getTypesenseClient } from '../GenericFunctions';

export class APIKeyResource extends BaseTypesenseResource {
  constructor() {
    super('apiKey');
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
          {
            name: 'Update',
            value: 'update',
            action: 'Update an API key',
            description: 'Update an API key configuration',
          },
        ],
        default: 'create',
      },
    ];
  }

  getFields(): INodeProperties[] {
    return [
      {
        displayName: 'API Key ID',
        name: 'apiKeyId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['apiKey'],
            operation: ['delete', 'get', 'update'],
          },
        },
        description: 'ID of the API key to operate on',
      },
      {
        displayName: 'JSON Input',
        name: 'jsonInput',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: {
            resource: ['apiKey'],
            operation: ['create', 'update'],
          },
        },
        description: 'Whether to provide the API key configuration as raw JSON',
      },
      {
        displayName: 'API Key Configuration (JSON)',
        name: 'apiKeyJson',
        type: 'string',
        typeOptions: {
          rows: 10,
        },
        default: '',
        displayOptions: {
          show: {
            resource: ['apiKey'],
            operation: ['create', 'update'],
            jsonInput: [true],
          },
        },
        description: 'JSON representation of the API key configuration',
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
            jsonInput: [false],
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
          { name: 'Manage API Keys', value: 'keys:manage' },
          { name: 'Analytics Access', value: 'analytics:read' },
          { name: 'Metrics Access', value: 'metrics:read' },
        ],
        default: ['documents:search'],
        required: true,
        displayOptions: {
          show: {
            resource: ['apiKey'],
            operation: ['create'],
            jsonInput: [false],
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
            jsonInput: [false],
          },
        },
        description:
          'Comma-separated list of collection names the API key can access (leave empty for all)',
      },
      {
        displayName: 'Expires At',
        name: 'expiresAt',
        type: 'number',
        default: 0,
        typeOptions: {
          minValue: 0,
        },
        displayOptions: {
          show: {
            resource: ['apiKey'],
            operation: ['create'],
            jsonInput: [false],
          },
        },
        description: 'Unix timestamp when the API key expires (0 for never)',
      },
      {
        displayName: 'Metadata (JSON)',
        name: 'metadataJson',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        displayOptions: {
          show: {
            resource: ['apiKey'],
            operation: ['create', 'update'],
            jsonInput: [false],
          },
        },
        description: 'Additional metadata for the API key as JSON',
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
      {
        displayName: 'Prefix',
        name: 'prefix',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['apiKey'],
            operation: ['getAll'],
          },
        },
        description: 'Prefix to filter API key IDs',
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
          return await this.createAPIKey(context, client, itemIndex);

        case 'delete':
          return await this.deleteAPIKey(context, client, itemIndex);

        case 'get':
          return await this.getAPIKey(context, client, itemIndex);

        case 'getAll':
          return await this.getAllAPIKeys(context, client, itemIndex);

        case 'update':
          return await this.updateAPIKey(context, client, itemIndex);

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

  private async createAPIKey(
    context: IExecuteFunctions,
    client: any,
    itemIndex: number,
  ): Promise<IDataObject> {
    const useJson = this.getBoolean(context, 'jsonInput', itemIndex);
    let apiKeyConfig: IDataObject;

    if (useJson) {
      const apiKeyJson = this.validateRequired(context, 'apiKeyJson', itemIndex);
      apiKeyConfig = jsonParse<IDataObject>(apiKeyJson);

      // Validate required fields
      if (!apiKeyConfig.description || !Array.isArray(apiKeyConfig.actions)) {
        throw new NodeOperationError(
          context.getNode(),
          'API key JSON must include "description" and "actions" properties.',
          { itemIndex },
        );
      }
    } else {
      apiKeyConfig = {
        description: this.validateRequired(context, 'description', itemIndex),
        actions: this.getArray(context, 'actions', itemIndex, ['documents:search']),
      };

      const collections = this.getOptional(context, 'collections', itemIndex);
      if (collections) {
        apiKeyConfig.collections = collections.split(',').map((c: string) => c.trim());
      }

      const expiresAt = this.getNumber(context, 'expiresAt', itemIndex, 0);
      if (expiresAt > 0) {
        apiKeyConfig.expires_at = expiresAt;
      }

      // Add metadata if provided
      const metadataJson = this.getOptional(context, 'metadataJson', itemIndex);
      if (metadataJson) {
        try {
          const metadata = jsonParse<IDataObject>(metadataJson);
          apiKeyConfig.metadata = metadata;
        } catch (error) {
          throw new NodeOperationError(context.getNode(), 'Metadata JSON must be valid JSON.', {
            itemIndex,
          });
        }
      }
    }

    const response = await client.keys().create(apiKeyConfig);
    return response as IDataObject;
  }

  private async deleteAPIKey(
    context: IExecuteFunctions,
    client: any,
    itemIndex: number,
  ): Promise<IDataObject> {
    const apiKeyId = this.validateRequired(context, 'apiKeyId', itemIndex);
    const response = await client.keys(apiKeyId).delete();
    return response as IDataObject;
  }

  private async getAPIKey(
    context: IExecuteFunctions,
    client: any,
    itemIndex: number,
  ): Promise<IDataObject> {
    const apiKeyId = this.validateRequired(context, 'apiKeyId', itemIndex);
    const response = await client.keys(apiKeyId).retrieve();
    return response as IDataObject;
  }

  private async getAllAPIKeys(
    context: IExecuteFunctions,
    client: any,
    itemIndex: number,
  ): Promise<IDataObject[]> {
    const returnAll = this.getBoolean(context, 'returnAll', itemIndex, true);
    const limit = this.getNumber(context, 'limit', itemIndex, 50);
    const prefix = this.getOptional(context, 'prefix', itemIndex, '');

    const response = await client.keys().retrieve();

    let apiKeys: IDataObject[] = [];
    if (Array.isArray(response)) {
      apiKeys = response as IDataObject[];
    } else {
      apiKeys = [response as IDataObject];
    }

    // Filter by prefix if provided
    if (prefix) {
      apiKeys = apiKeys.filter(
        (key: IDataObject) => key.id && (key.id as string).startsWith(prefix),
      );
    }

    if (returnAll) {
      return apiKeys;
    }

    return apiKeys.slice(0, limit);
  }

  private async updateAPIKey(
    context: IExecuteFunctions,
    client: any,
    itemIndex: number,
  ): Promise<IDataObject> {
    const apiKeyId = this.validateRequired(context, 'apiKeyId', itemIndex);
    const useJson = this.getBoolean(context, 'jsonInput', itemIndex);
    let updateConfig: IDataObject;

    if (useJson) {
      const apiKeyJson = this.validateRequired(context, 'apiKeyJson', itemIndex);
      updateConfig = jsonParse<IDataObject>(apiKeyJson);
    } else {
      updateConfig = {};

      const description = this.getOptional(context, 'description', itemIndex);
      if (description) {
        updateConfig.description = description;
      }

      const actions = this.getOptional(context, 'actions', itemIndex);
      if (actions && Array.isArray(actions)) {
        updateConfig.actions = actions;
      }

      const collections = this.getOptional(context, 'collections', itemIndex);
      if (collections) {
        updateConfig.collections = collections.split(',').map((c: string) => c.trim());
      }

      const expiresAt = this.getNumber(context, 'expiresAt', itemIndex, 0);
      if (expiresAt > 0) {
        updateConfig.expires_at = expiresAt;
      }

      // Add metadata if provided
      const metadataJson = this.getOptional(context, 'metadataJson', itemIndex);
      if (metadataJson) {
        try {
          const metadata = jsonParse<IDataObject>(metadataJson);
          updateConfig.metadata = metadata;
        } catch (error) {
          throw new NodeOperationError(context.getNode(), 'Metadata JSON must be valid JSON.', {
            itemIndex,
          });
        }
      }
    }

    if (Object.keys(updateConfig).length === 0) {
      throw new NodeOperationError(
        context.getNode(),
        'Please provide at least one field to update.',
        { itemIndex },
      );
    }

    const response = await client.keys(apiKeyId).update(updateConfig);
    return response as IDataObject;
  }
}
