"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionResource = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const BaseTypesenseResource_1 = require("./BaseTypesenseResource");
const GenericFunctions_1 = require("../GenericFunctions");
class CollectionResource extends BaseTypesenseResource_1.BaseTypesenseResource {
    constructor() {
        super('collection');
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
                        resource: ['collection'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        action: 'Create a collection',
                        description: 'Create a new collection',
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        action: 'Delete a collection',
                        description: 'Delete an existing collection',
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        action: 'Get a collection',
                        description: 'Retrieve a collection by name',
                    },
                    {
                        name: 'Get Many',
                        value: 'getAll',
                        action: 'Get many collections',
                        description: 'List all collections',
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        action: 'Update a collection',
                        description: 'Update a collection schema',
                    },
                ],
                default: 'create',
            },
        ];
    }
    getFields() {
        return [
            {
                displayName: 'Collection Name',
                name: 'collectionId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['collection'],
                        operation: ['delete', 'get', 'update'],
                    },
                },
                description: 'Name of the collection to operate on',
            },
            {
                displayName: 'JSON Parameters',
                name: 'jsonParameters',
                type: 'boolean',
                default: false,
                displayOptions: {
                    show: {
                        resource: ['collection'],
                        operation: ['create', 'update'],
                    },
                },
                description: 'Whether to provide the schema as raw JSON',
            },
            {
                displayName: 'Collection Schema (JSON)',
                name: 'schemaJson',
                type: 'string',
                typeOptions: {
                    rows: 6,
                },
                default: '',
                displayOptions: {
                    show: {
                        resource: ['collection'],
                        operation: ['create', 'update'],
                        jsonParameters: [true],
                    },
                },
                description: 'JSON representation of the collection schema',
            },
            {
                displayName: 'Collection Schema',
                name: 'schemaParameters',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['collection'],
                        operation: ['create'],
                        jsonParameters: [false],
                    },
                },
                options: [
                    {
                        displayName: 'Name',
                        name: 'name',
                        type: 'string',
                        default: '',
                        required: true,
                    },
                    {
                        displayName: 'Enable Nested Fields',
                        name: 'enableNestedFields',
                        type: 'boolean',
                        default: false,
                        description: 'Allow nested object fields in the collection schema',
                    },
                    {
                        displayName: 'Fields',
                        name: 'fields',
                        type: 'fixedCollection',
                        default: [],
                        typeOptions: {
                            multipleValues: true,
                        },
                        options: [
                            {
                                name: 'field',
                                displayName: 'Field',
                                values: [
                                    {
                                        displayName: 'Name',
                                        name: 'name',
                                        type: 'string',
                                        default: '',
                                        required: true,
                                    },
                                    {
                                        displayName: 'Type',
                                        name: 'type',
                                        type: 'options',
                                        options: [
                                            { name: 'String', value: 'string' },
                                            { name: 'Int 32', value: 'int32' },
                                            { name: 'Int 64', value: 'int64' },
                                            { name: 'Float', value: 'float' },
                                            { name: 'Bool', value: 'bool' },
                                            { name: 'Geo Point', value: 'geopoint' },
                                            { name: 'String Array', value: 'string[]' },
                                            { name: 'Int 32 Array', value: 'int32[]' },
                                            { name: 'Float Array', value: 'float[]' },
                                            { name: 'Bool Array', value: 'bool[]' },
                                            { name: 'Object', value: 'object' },
                                        ],
                                        default: 'string',
                                        required: true,
                                    },
                                    {
                                        displayName: 'Facet',
                                        name: 'facet',
                                        type: 'boolean',
                                        default: false,
                                        description: 'Whether the field should be faceted',
                                    },
                                    {
                                        displayName: 'Optional',
                                        name: 'optional',
                                        type: 'boolean',
                                        default: false,
                                        description: 'Whether the field is optional',
                                    },
                                    {
                                        displayName: 'Sort',
                                        name: 'sort',
                                        type: 'boolean',
                                        default: false,
                                        description: 'Whether the field can be used for sorting',
                                    },
                                    {
                                        displayName: 'Infix Search',
                                        name: 'infix',
                                        type: 'boolean',
                                        default: false,
                                        description: 'Enable infix (contains) searches on this field',
                                    },
                                    {
                                        displayName: 'Index',
                                        name: 'index',
                                        type: 'boolean',
                                        default: true,
                                        description: 'Whether the field should be indexed',
                                    },
                                    {
                                        displayName: 'Locale',
                                        name: 'locale',
                                        type: 'string',
                                        default: '',
                                        description: 'Locale to use for string fields',
                                    },
                                    {
                                        displayName: 'Number of Dimensions',
                                        name: 'numDim',
                                        type: 'number',
                                        default: 0,
                                        typeOptions: {
                                            minValue: 0,
                                        },
                                        description: 'Number of dimensions for vector fields',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                displayName: 'Additional Options',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Option',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['collection'],
                        operation: ['create'],
                        jsonParameters: [false],
                    },
                },
                options: [
                    {
                        displayName: 'Default Sorting Field',
                        name: 'defaultSortingField',
                        type: 'string',
                        default: '',
                        description: 'Field to use for default sorting operations',
                    },
                    {
                        displayName: 'Token Separators',
                        name: 'tokenSeparators',
                        type: 'string',
                        default: '',
                        description: 'Comma-separated list of token separator characters',
                    },
                    {
                        displayName: 'Symbols to Index',
                        name: 'symbolsToIndex',
                        type: 'string',
                        default: '',
                        description: 'Comma-separated list of symbols to include in the index',
                    },
                    {
                        displayName: 'Metadata (JSON)',
                        name: 'metadataJson',
                        type: 'string',
                        typeOptions: {
                            rows: 3,
                        },
                        default: '',
                        description: 'Optional metadata to store with the collection schema',
                    },
                ],
            },
            {
                displayName: 'Collection Schema',
                name: 'updateSchemaParameters',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['collection'],
                        operation: ['update'],
                        jsonParameters: [false],
                    },
                },
                options: [
                    {
                        displayName: 'Enable Nested Fields',
                        name: 'enableNestedFields',
                        type: 'boolean',
                        default: false,
                        description: 'Allow nested object fields in the collection schema',
                    },
                    {
                        displayName: 'Fields',
                        name: 'fields',
                        type: 'fixedCollection',
                        default: [],
                        typeOptions: {
                            multipleValues: true,
                        },
                        options: [
                            {
                                name: 'field',
                                displayName: 'Field',
                                values: [
                                    {
                                        displayName: 'Name',
                                        name: 'name',
                                        type: 'string',
                                        default: '',
                                        required: true,
                                    },
                                    {
                                        displayName: 'Type',
                                        name: 'type',
                                        type: 'options',
                                        options: [
                                            { name: 'String', value: 'string' },
                                            { name: 'Int 32', value: 'int32' },
                                            { name: 'Int 64', value: 'int64' },
                                            { name: 'Float', value: 'float' },
                                            { name: 'Bool', value: 'bool' },
                                            { name: 'Geo Point', value: 'geopoint' },
                                            { name: 'String Array', value: 'string[]' },
                                            { name: 'Int 32 Array', value: 'int32[]' },
                                            { name: 'Float Array', value: 'float[]' },
                                            { name: 'Bool Array', value: 'bool[]' },
                                            { name: 'Object', value: 'object' },
                                        ],
                                        default: 'string',
                                        required: true,
                                    },
                                    {
                                        displayName: 'Facet',
                                        name: 'facet',
                                        type: 'boolean',
                                        default: false,
                                    },
                                    {
                                        displayName: 'Optional',
                                        name: 'optional',
                                        type: 'boolean',
                                        default: false,
                                    },
                                    {
                                        displayName: 'Sort',
                                        name: 'sort',
                                        type: 'boolean',
                                        default: false,
                                    },
                                    {
                                        displayName: 'Infix Search',
                                        name: 'infix',
                                        type: 'boolean',
                                        default: false,
                                    },
                                    {
                                        displayName: 'Index',
                                        name: 'index',
                                        type: 'boolean',
                                        default: true,
                                    },
                                    {
                                        displayName: 'Locale',
                                        name: 'locale',
                                        type: 'string',
                                        default: '',
                                    },
                                    {
                                        displayName: 'Number of Dimensions',
                                        name: 'numDim',
                                        type: 'number',
                                        default: 0,
                                        typeOptions: {
                                            minValue: 0,
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                displayName: 'Additional Options',
                name: 'updateAdditionalFields',
                type: 'collection',
                placeholder: 'Add Option',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['collection'],
                        operation: ['update'],
                        jsonParameters: [false],
                    },
                },
                options: [
                    {
                        displayName: 'Default Sorting Field',
                        name: 'defaultSortingField',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Token Separators',
                        name: 'tokenSeparators',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Symbols to Index',
                        name: 'symbolsToIndex',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Metadata (JSON)',
                        name: 'metadataJson',
                        type: 'string',
                        typeOptions: {
                            rows: 3,
                        },
                        default: '',
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
                        resource: ['collection'],
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
                        resource: ['collection'],
                        operation: ['getAll'],
                        returnAll: [false],
                    },
                },
                description: 'Maximum number of collections to retrieve',
            },
        ];
    }
    async execute(operation, context, itemIndex) {
        const client = await GenericFunctions_1.getTypesenseClient.call(context);
        try {
            switch (operation) {
                case 'create':
                    return await this.createCollection(context, client, itemIndex);
                case 'delete':
                    return await this.deleteCollection(context, client, itemIndex);
                case 'get':
                    return await this.getCollection(context, client, itemIndex);
                case 'getAll':
                    return await this.getAllCollections(context, client, itemIndex);
                case 'update':
                    return await this.updateCollection(context, client, itemIndex);
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
    async createCollection(context, client, itemIndex) {
        const useJson = this.getBoolean(context, 'jsonParameters', itemIndex);
        let schemaPayload;
        if (useJson) {
            const schemaJson = this.validateRequired(context, 'schemaJson', itemIndex);
            schemaPayload = (0, n8n_workflow_1.jsonParse)(schemaJson);
            if (!schemaPayload.name || !Array.isArray(schemaPayload.fields)) {
                throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Schema JSON must include both "name" and "fields" properties.', { itemIndex });
            }
        }
        else {
            const schemaParameters = this.getObject(context, 'schemaParameters', itemIndex);
            const additionalFields = this.getObject(context, 'additionalFields', itemIndex);
            schemaPayload = GenericFunctions_1.buildCollectionCreateSchema.call(context, schemaParameters, additionalFields);
        }
        const response = await client.collections().create(schemaPayload);
        return response;
    }
    async deleteCollection(context, client, itemIndex) {
        const collectionId = this.validateRequired(context, 'collectionId', itemIndex);
        const response = await client.collections(collectionId).delete();
        return response;
    }
    async getCollection(context, client, itemIndex) {
        const collectionId = this.validateRequired(context, 'collectionId', itemIndex);
        const response = await client.collections(collectionId).retrieve();
        return response;
    }
    async getAllCollections(context, client, itemIndex) {
        const returnAll = this.getBoolean(context, 'returnAll', itemIndex, true);
        const allCollections = (await client
            .collections()
            .retrieve());
        if (!Array.isArray(allCollections)) {
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Unexpected response received from Typesense.', { itemIndex });
        }
        if (returnAll) {
            return allCollections;
        }
        const limit = this.getNumber(context, 'limit', itemIndex, 50);
        return allCollections.slice(0, limit);
    }
    async updateCollection(context, client, itemIndex) {
        const collectionId = this.validateRequired(context, 'collectionId', itemIndex);
        const useJson = this.getBoolean(context, 'jsonParameters', itemIndex);
        let updatePayload;
        if (useJson) {
            const schemaJson = this.validateRequired(context, 'schemaJson', itemIndex);
            updatePayload = (0, n8n_workflow_1.jsonParse)(schemaJson);
        }
        else {
            const schemaParameters = this.getObject(context, 'updateSchemaParameters', itemIndex);
            const additionalFields = this.getObject(context, 'updateAdditionalFields', itemIndex);
            updatePayload = GenericFunctions_1.buildCollectionUpdateSchema.call(context, schemaParameters, additionalFields);
        }
        if (Object.keys(updatePayload).length === 0) {
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Please provide at least one field to update.', { itemIndex });
        }
        const response = await client.collections(collectionId).update(updatePayload);
        return response;
    }
}
exports.CollectionResource = CollectionResource;
