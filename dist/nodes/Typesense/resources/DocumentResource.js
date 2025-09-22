"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentResource = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const BaseTypesenseResource_1 = require("./BaseTypesenseResource");
const GenericFunctions_1 = require("../GenericFunctions");
class DocumentResource extends BaseTypesenseResource_1.BaseTypesenseResource {
    constructor() {
        super('document');
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
                        resource: ['document'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        action: 'Create a document',
                        description: 'Create a new document in a collection',
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        action: 'Delete a document',
                        description: 'Delete a document by ID',
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        action: 'Get a document',
                        description: 'Retrieve a document by ID',
                    },
                    {
                        name: 'Get Many',
                        value: 'getAll',
                        action: 'Get many documents',
                        description: 'List documents in a collection',
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        action: 'Update a document',
                        description: 'Update a document by ID',
                    },
                    {
                        name: 'Search',
                        value: 'search',
                        action: 'Search documents',
                        description: 'Search for documents in a collection',
                    },
                    {
                        name: 'Delete by Query',
                        value: 'deleteByQuery',
                        action: 'Delete documents by query',
                        description: 'Delete documents matching a query',
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
                name: 'collection',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['create', 'delete', 'get', 'getAll', 'update', 'search', 'deleteByQuery'],
                    },
                },
                description: 'Name of the collection to operate on',
            },
            {
                displayName: 'Document ID',
                name: 'documentId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['delete', 'get', 'update'],
                    },
                },
                description: 'ID of the document to operate on',
            },
            {
                displayName: 'JSON Input',
                name: 'jsonInput',
                type: 'boolean',
                default: false,
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['create', 'update'],
                    },
                },
                description: 'Whether to provide the document data as raw JSON',
            },
            {
                displayName: 'Document Data (JSON)',
                name: 'documentJson',
                type: 'string',
                typeOptions: {
                    rows: 8,
                },
                default: '',
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['create', 'update'],
                        jsonInput: [true],
                    },
                },
                description: 'JSON representation of the document data',
            },
            {
                displayName: 'Document Fields',
                name: 'documentFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['create', 'update'],
                        jsonInput: [false],
                    },
                },
                options: [
                    {
                        displayName: 'Field Name',
                        name: 'fieldName',
                        type: 'string',
                        default: '',
                        description: 'Name of the field',
                    },
                    {
                        displayName: 'Field Value',
                        name: 'fieldValue',
                        type: 'string',
                        default: '',
                        description: 'Value of the field (will be parsed as JSON)',
                    },
                ],
            },
            {
                displayName: 'Search Query',
                name: 'query',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['search', 'deleteByQuery'],
                    },
                },
                description: 'Search query text',
            },
            {
                displayName: 'Query By',
                name: 'queryBy',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['search'],
                    },
                },
                description: 'Comma-separated list of fields to search in',
            },
            {
                displayName: 'Filter By',
                name: 'filterBy',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['search', 'getAll', 'deleteByQuery'],
                    },
                },
                description: 'Filter expression (e.g., num_employees:>100)',
            },
            {
                displayName: 'Sort By',
                name: 'sortBy',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['search', 'getAll'],
                    },
                },
                description: 'Sort expression (e.g., num_employees:desc)',
            },
            {
                displayName: 'Facet By',
                name: 'facetBy',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['search'],
                    },
                },
                description: 'Comma-separated list of fields to facet by',
            },
            {
                displayName: 'Return All',
                name: 'returnAll',
                type: 'boolean',
                default: true,
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['getAll', 'search'],
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
                        resource: ['document'],
                        operation: ['getAll', 'search'],
                        returnAll: [false],
                    },
                },
                description: 'Maximum number of documents to retrieve',
            },
            {
                displayName: 'Page',
                name: 'page',
                type: 'number',
                default: 1,
                typeOptions: {
                    minValue: 1,
                },
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['search'],
                    },
                },
                description: 'Page number for pagination',
            },
            {
                displayName: 'Include Fields',
                name: 'includeFields',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['search', 'getAll'],
                    },
                },
                description: 'Comma-separated list of fields to include in results',
            },
            {
                displayName: 'Exclude Fields',
                name: 'excludeFields',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['search', 'getAll'],
                    },
                },
                description: 'Comma-separated list of fields to exclude from results',
            },
            {
                displayName: 'Search Parameters',
                name: 'searchParameters',
                type: 'collection',
                placeholder: 'Add Parameter',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['document'],
                        operation: ['search'],
                    },
                },
                options: [
                    {
                        displayName: 'Prefix',
                        name: 'prefix',
                        type: 'string',
                        default: '',
                        description: 'Returns suggestions that match the given prefix',
                    },
                    {
                        displayName: 'Infix',
                        name: 'infix',
                        type: 'string',
                        default: '',
                        description: 'Infix search query (e.g., "hat" in "hatstand")',
                    },
                    {
                        displayName: 'Highlight Full Fields',
                        name: 'highlightFullFields',
                        type: 'string',
                        default: '',
                        description: 'Comma-separated list of fields to highlight',
                    },
                    {
                        displayName: 'Highlight Field Prefixes',
                        name: 'highlightFieldPrefixes',
                        type: 'string',
                        typeOptions: {
                            rows: 2,
                        },
                        default: '',
                        description: 'Prefix settings for highlighted fields',
                    },
                    {
                        displayName: 'Enable Highlighting',
                        name: 'enableHighlighting',
                        type: 'boolean',
                        default: true,
                        description: 'Enable search result highlighting',
                    },
                ],
            },
        ];
    }
    async execute(operation, context, itemIndex) {
        const client = await GenericFunctions_1.getTypesenseClient.call(context);
        try {
            switch (operation) {
                case 'create':
                    return await this.createDocument(context, client, itemIndex);
                case 'delete':
                    return await this.deleteDocument(context, client, itemIndex);
                case 'get':
                    return await this.getDocument(context, client, itemIndex);
                case 'getAll':
                    return await this.getAllDocuments(context, client, itemIndex);
                case 'update':
                    return await this.updateDocument(context, client, itemIndex);
                case 'search':
                    return await this.searchDocuments(context, client, itemIndex);
                case 'deleteByQuery':
                    return await this.deleteByQuery(context, client, itemIndex);
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
    async createDocument(context, client, itemIndex) {
        const collection = this.validateRequired(context, 'collection', itemIndex);
        const document = await this.buildDocumentData(context, itemIndex);
        const response = await client.collections(collection).documents().create(document);
        return response;
    }
    async deleteDocument(context, client, itemIndex) {
        const collection = this.validateRequired(context, 'collection', itemIndex);
        const documentId = this.validateRequired(context, 'documentId', itemIndex);
        const response = await client.collections(collection).documents(documentId).delete();
        return response;
    }
    async getDocument(context, client, itemIndex) {
        const collection = this.validateRequired(context, 'collection', itemIndex);
        const documentId = this.validateRequired(context, 'documentId', itemIndex);
        const response = await client.collections(collection).documents(documentId).retrieve();
        return response;
    }
    async getAllDocuments(context, client, itemIndex) {
        const collection = this.validateRequired(context, 'collection', itemIndex);
        const returnAll = this.getBoolean(context, 'returnAll', itemIndex, true);
        const searchParams = {};
        if (this.getOptional(context, 'filterBy', itemIndex)) {
            searchParams.filter_by = this.getOptional(context, 'filterBy', itemIndex);
        }
        if (this.getOptional(context, 'sortBy', itemIndex)) {
            searchParams.sort_by = this.getOptional(context, 'sortBy', itemIndex);
        }
        if (this.getOptional(context, 'includeFields', itemIndex)) {
            searchParams.include_fields = this.getOptional(context, 'includeFields', itemIndex);
        }
        if (this.getOptional(context, 'excludeFields', itemIndex)) {
            searchParams.exclude_fields = this.getOptional(context, 'excludeFields', itemIndex);
        }
        searchParams.q = '*'; // Match all documents
        const response = await client.collections(collection).documents().search(searchParams);
        if (!returnAll) {
            const limit = this.getNumber(context, 'limit', itemIndex, 50);
            return response.hits?.slice(0, limit).map((hit) => hit.document) || [];
        }
        return response.hits?.map((hit) => hit.document) || [];
    }
    async updateDocument(context, client, itemIndex) {
        const collection = this.validateRequired(context, 'collection', itemIndex);
        const documentId = this.validateRequired(context, 'documentId', itemIndex);
        const document = await this.buildDocumentData(context, itemIndex);
        const response = await client.collections(collection).documents(documentId).update(document);
        return response;
    }
    async searchDocuments(context, client, itemIndex) {
        const collection = this.validateRequired(context, 'collection', itemIndex);
        const query = this.validateRequired(context, 'query', itemIndex);
        const searchParams = {
            q: query,
        };
        if (this.getOptional(context, 'queryBy', itemIndex)) {
            searchParams.query_by = this.getOptional(context, 'queryBy', itemIndex);
        }
        if (this.getOptional(context, 'filterBy', itemIndex)) {
            searchParams.filter_by = this.getOptional(context, 'filterBy', itemIndex);
        }
        if (this.getOptional(context, 'sortBy', itemIndex)) {
            searchParams.sort_by = this.getOptional(context, 'sortBy', itemIndex);
        }
        if (this.getOptional(context, 'facetBy', itemIndex)) {
            searchParams.facet_by = this.getOptional(context, 'facetBy', itemIndex);
        }
        if (this.getOptional(context, 'includeFields', itemIndex)) {
            searchParams.include_fields = this.getOptional(context, 'includeFields', itemIndex);
        }
        if (this.getOptional(context, 'excludeFields', itemIndex)) {
            searchParams.exclude_fields = this.getOptional(context, 'excludeFields', itemIndex);
        }
        const page = this.getNumber(context, 'page', itemIndex, 1);
        searchParams.page = page;
        const returnAll = this.getBoolean(context, 'returnAll', itemIndex, true);
        if (!returnAll) {
            const limit = this.getNumber(context, 'limit', itemIndex, 50);
            searchParams.per_page = limit;
        }
        // Handle additional search parameters
        const searchParameters = this.getObject(context, 'searchParameters', itemIndex);
        if (searchParameters) {
            Object.assign(searchParams, this.processSearchParameters(searchParameters));
        }
        const response = await client.collections(collection).documents().search(searchParams);
        return [response];
    }
    async deleteByQuery(context, client, itemIndex) {
        const collection = this.validateRequired(context, 'collection', itemIndex);
        const query = this.validateRequired(context, 'query', itemIndex);
        const filterBy = this.getOptional(context, 'filterBy', itemIndex);
        const response = await client.collections(collection).documents().delete({ filter_by: filterBy, q: query });
        return response;
    }
    async buildDocumentData(context, itemIndex) {
        const useJson = this.getBoolean(context, 'jsonInput', itemIndex);
        if (useJson) {
            const documentJson = this.validateRequired(context, 'documentJson', itemIndex);
            return (0, n8n_workflow_1.jsonParse)(documentJson);
        }
        else {
            const documentFields = this.getObject(context, 'documentFields', itemIndex);
            const document = {};
            if (documentFields && typeof documentFields === 'object') {
                for (const [fieldName, fieldValue] of Object.entries(documentFields)) {
                    if (fieldName && fieldValue) {
                        try {
                            // Try to parse the field value as JSON, fallback to string
                            document[fieldName] = (0, n8n_workflow_1.jsonParse)(fieldValue);
                        }
                        catch {
                            document[fieldName] = fieldValue;
                        }
                    }
                }
            }
            return document;
        }
    }
    processSearchParameters(params) {
        const processed = {};
        if (params.prefix) {
            processed.prefix = params.prefix;
        }
        if (params.infix) {
            processed.infix = params.infix;
        }
        if (params.highlightFullFields) {
            processed.highlight_full_fields = params.highlightFullFields;
        }
        if (params.highlightFieldPrefixes) {
            processed.highlight_field_prefixes = params.highlightFieldPrefixes;
        }
        if (params.enableHighlighting !== undefined) {
            processed.enable_highlighting = params.enableHighlighting;
        }
        return processed;
    }
}
exports.DocumentResource = DocumentResource;
