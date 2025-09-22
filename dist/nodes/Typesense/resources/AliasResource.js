"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AliasResource = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const BaseTypesenseResource_1 = require("./BaseTypesenseResource");
const GenericFunctions_1 = require("../GenericFunctions");
class AliasResource extends BaseTypesenseResource_1.BaseTypesenseResource {
    constructor() {
        super('alias');
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
    }
    getFields() {
        return [
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
            {
                displayName: 'Prefix',
                name: 'prefix',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['alias'],
                        operation: ['getAll'],
                    },
                },
                description: 'Prefix to filter alias names',
            },
        ];
    }
    async execute(operation, context, itemIndex) {
        const client = await GenericFunctions_1.getTypesenseClient.call(context);
        try {
            switch (operation) {
                case 'create':
                    return await this.createAlias(context, client, itemIndex);
                case 'delete':
                    return await this.deleteAlias(context, client, itemIndex);
                case 'get':
                    return await this.getAlias(context, client, itemIndex);
                case 'getAll':
                    return await this.getAllAliases(context, client, itemIndex);
                case 'update':
                    return await this.updateAlias(context, client, itemIndex);
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
    async createAlias(context, client, itemIndex) {
        const aliasName = this.validateRequired(context, 'aliasName', itemIndex);
        const collectionName = this.validateRequired(context, 'collectionName', itemIndex);
        const aliasConfig = {
            collection_name: collectionName,
        };
        const response = await client.aliases().upsert(aliasName, aliasConfig);
        return response;
    }
    async deleteAlias(context, client, itemIndex) {
        const aliasName = this.validateRequired(context, 'aliasName', itemIndex);
        const response = await client.aliases(aliasName).delete();
        return response;
    }
    async getAlias(context, client, itemIndex) {
        const aliasName = this.validateRequired(context, 'aliasName', itemIndex);
        const response = await client.aliases(aliasName).retrieve();
        return response;
    }
    async getAllAliases(context, client, itemIndex) {
        const returnAll = this.getBoolean(context, 'returnAll', itemIndex, true);
        const limit = this.getNumber(context, 'limit', itemIndex, 50);
        const prefix = this.getOptional(context, 'prefix', itemIndex, '');
        try {
            const response = await client.aliases().retrieve();
            let aliases = [];
            if (Array.isArray(response)) {
                aliases = response;
            }
            else if (response && typeof response === 'object') {
                aliases = [response];
            }
            // Filter by prefix if provided
            if (prefix) {
                aliases = aliases.filter((alias) => alias.name && alias.name.startsWith(prefix));
            }
            if (returnAll) {
                return aliases;
            }
            return aliases.slice(0, limit);
        }
        catch (error) {
            // If aliases API is not available, return empty array
            // This maintains compatibility with older Typesense versions
            return [];
        }
    }
    async updateAlias(context, client, itemIndex) {
        const aliasName = this.validateRequired(context, 'aliasName', itemIndex);
        const collectionName = this.validateRequired(context, 'collectionName', itemIndex);
        const aliasConfig = {
            collection_name: collectionName,
        };
        const response = await client.aliases().upsert(aliasName, aliasConfig);
        return response;
    }
}
exports.AliasResource = AliasResource;
