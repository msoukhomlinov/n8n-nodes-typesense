"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIKeyResource = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const BaseTypesenseResource_1 = require("./BaseTypesenseResource");
const GenericFunctions_1 = require("../GenericFunctions");
class APIKeyResource extends BaseTypesenseResource_1.BaseTypesenseResource {
    constructor() {
        super('apiKey');
    }
    getOperations() {
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
    getFields() {
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
                description: 'Comma-separated list of collection names the API key can access (leave empty for all)',
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
    async execute(operation, context, itemIndex) {
        const client = await GenericFunctions_1.getTypesenseClient.call(context);
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
                    throw new n8n_workflow_1.NodeOperationError(context.getNode(), `The operation "${operation}" is not supported for ${this.resourceName}.`, { itemIndex });
            }
        }
        catch (error) {
            if (context.continueOnFail()) {
                return { error: error.message };
            }
            throw new n8n_workflow_1.NodeApiError(context.getNode(), error, { itemIndex });
        }
    }
    async createAPIKey(context, client, itemIndex) {
        const useJson = this.getBoolean(context, 'jsonInput', itemIndex);
        let apiKeyConfig;
        if (useJson) {
            const apiKeyJson = this.validateRequired(context, 'apiKeyJson', itemIndex);
            apiKeyConfig = (0, n8n_workflow_1.jsonParse)(apiKeyJson);
            // Validate required fields
            if (!apiKeyConfig.description || !Array.isArray(apiKeyConfig.actions)) {
                throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'API key JSON must include "description" and "actions" properties.', { itemIndex });
            }
        }
        else {
            apiKeyConfig = {
                description: this.validateRequired(context, 'description', itemIndex),
                actions: this.getArray(context, 'actions', itemIndex, ['documents:search']),
            };
            const collections = this.getOptional(context, 'collections', itemIndex);
            if (collections) {
                apiKeyConfig.collections = collections.split(',').map((c) => c.trim());
            }
            const expiresAt = this.getNumber(context, 'expiresAt', itemIndex, 0);
            if (expiresAt > 0) {
                apiKeyConfig.expires_at = expiresAt;
            }
            // Add metadata if provided
            const metadataJson = this.getOptional(context, 'metadataJson', itemIndex);
            if (metadataJson) {
                try {
                    const metadata = (0, n8n_workflow_1.jsonParse)(metadataJson);
                    apiKeyConfig.metadata = metadata;
                }
                catch (error) {
                    throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Metadata JSON must be valid JSON.', { itemIndex });
                }
            }
        }
        const response = await client.keys().create(apiKeyConfig);
        return response;
    }
    async deleteAPIKey(context, client, itemIndex) {
        const apiKeyId = this.validateRequired(context, 'apiKeyId', itemIndex);
        const response = await client.keys(apiKeyId).delete();
        return response;
    }
    async getAPIKey(context, client, itemIndex) {
        const apiKeyId = this.validateRequired(context, 'apiKeyId', itemIndex);
        const response = await client.keys(apiKeyId).retrieve();
        return response;
    }
    async getAllAPIKeys(context, client, itemIndex) {
        const returnAll = this.getBoolean(context, 'returnAll', itemIndex, true);
        const limit = this.getNumber(context, 'limit', itemIndex, 50);
        const prefix = this.getOptional(context, 'prefix', itemIndex, '');
        const response = await client.keys().retrieve();
        let apiKeys = [];
        if (Array.isArray(response)) {
            apiKeys = response;
        }
        else {
            apiKeys = [response];
        }
        // Filter by prefix if provided
        if (prefix) {
            apiKeys = apiKeys.filter((key) => key.id && key.id.startsWith(prefix));
        }
        if (returnAll) {
            return apiKeys;
        }
        return apiKeys.slice(0, limit);
    }
    async updateAPIKey(context, client, itemIndex) {
        const apiKeyId = this.validateRequired(context, 'apiKeyId', itemIndex);
        const useJson = this.getBoolean(context, 'jsonInput', itemIndex);
        let updateConfig;
        if (useJson) {
            const apiKeyJson = this.validateRequired(context, 'apiKeyJson', itemIndex);
            updateConfig = (0, n8n_workflow_1.jsonParse)(apiKeyJson);
        }
        else {
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
                updateConfig.collections = collections.split(',').map((c) => c.trim());
            }
            const expiresAt = this.getNumber(context, 'expiresAt', itemIndex, 0);
            if (expiresAt > 0) {
                updateConfig.expires_at = expiresAt;
            }
            // Add metadata if provided
            const metadataJson = this.getOptional(context, 'metadataJson', itemIndex);
            if (metadataJson) {
                try {
                    const metadata = (0, n8n_workflow_1.jsonParse)(metadataJson);
                    updateConfig.metadata = metadata;
                }
                catch (error) {
                    throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Metadata JSON must be valid JSON.', { itemIndex });
                }
            }
        }
        if (Object.keys(updateConfig).length === 0) {
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Please provide at least one field to update.', { itemIndex });
        }
        const response = await client.keys(apiKeyId).update(updateConfig);
        return response;
    }
}
exports.APIKeyResource = APIKeyResource;
