import type { IDataObject, IExecuteFunctions, INodeProperties, JsonObject } from 'n8n-workflow';
import { NodeApiError, NodeOperationError, jsonParse } from 'n8n-workflow';
import type Client from 'typesense/lib/Typesense/Client';

import { BaseTypesenseResource } from './BaseTypesenseResource';
import { getTypesenseClient } from '../GenericFunctions';

interface TypesenseCredentials {
  apiKey: string;
  host: string;
  port?: number;
  protocol: 'http' | 'https';
}

export class DocumentResource extends BaseTypesenseResource {
  constructor() {
    super('document');
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

  getFields(): INodeProperties[] {
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

  async execute(
    operation: string,
    context: IExecuteFunctions,
    itemIndex: number,
  ): Promise<IDataObject | IDataObject[]> {
    const client = await getTypesenseClient.call(context);

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

        case 'import':
          return await this.importDocuments(context, client, itemIndex);

        case 'export':
          return await this.exportDocuments(context, client, itemIndex);

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
      throw new NodeApiError(context.getNode(), error as JsonObject, { itemIndex });
    }
  }

  private async createDocument(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
    const document = await this.buildDocumentData(context, itemIndex);

    const response = await client.collections(collection).documents().create(document);
    return response as IDataObject;
  }

  private async deleteDocument(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
    const documentId = this.validateRequired(context, 'documentId', itemIndex);

    const response = await client.collections(collection).documents(documentId).delete();
    return response as IDataObject;
  }

  private async getDocument(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
    const documentId = this.validateRequired(context, 'documentId', itemIndex);

    const response = await client.collections(collection).documents(documentId).retrieve();
    const result = response as IDataObject;
    const filterColumns = this.getOptional(context, 'filterColumns', itemIndex) as string | undefined;
    return this.filterColumns(result, filterColumns) as IDataObject;
  }

  private async getAllDocuments(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject[]> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
    const returnAll = this.getBoolean(context, 'returnAll', itemIndex, true);

    const searchParams: IDataObject = {};

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
    const searchResponse = response as unknown as IDataObject;
    const hits = ((searchResponse.hits as unknown) as IDataObject[]) || [];

    let documents: IDataObject[];
    if (!returnAll) {
      const limit = this.getNumber(context, 'limit', itemIndex, 50);
      documents = hits.slice(0, limit).map((hit: IDataObject) => hit.document as IDataObject);
    } else {
      documents = hits.map((hit: IDataObject) => hit.document as IDataObject);
    }

    const filterColumns = this.getOptional(context, 'filterColumns', itemIndex) as string | undefined;
    return this.filterColumns(documents, filterColumns) as IDataObject[];
  }

  private async updateDocument(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
    const documentId = this.validateRequired(context, 'documentId', itemIndex);
    const document = await this.buildDocumentData(context, itemIndex);

    const response = await client.collections(collection).documents(documentId).update(document);
    return response as IDataObject;
  }

  private async searchDocuments(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject[]> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
    const query = this.validateRequired(context, 'query', itemIndex);

    const searchParams: IDataObject = {
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
    return [response as unknown as IDataObject];
  }

  private async deleteByQuery(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
    const filterBy = this.validateRequired(context, 'filterBy', itemIndex);

    const response = await client
      .collections(collection)
      .documents()
      .delete({ filter_by: filterBy });
    return response as unknown as IDataObject;
  }

  private async buildDocumentData(
    context: IExecuteFunctions,
    itemIndex: number,
  ): Promise<IDataObject> {
    const useJson = this.getBoolean(context, 'jsonInput', itemIndex);

    if (useJson) {
      const documentJson = this.validateRequired(context, 'documentJson', itemIndex);
      return jsonParse<IDataObject>(documentJson);
    } else {
      const documentFields = this.getObject(context, 'documentFields', itemIndex);
      const document: IDataObject = {};

      if (documentFields && typeof documentFields === 'object') {
        for (const [fieldName, fieldValue] of Object.entries(documentFields)) {
          if (fieldName && fieldValue) {
            try {
              // Try to parse the field value as JSON, fallback to string
              document[fieldName] = jsonParse(fieldValue as string);
            } catch {
              document[fieldName] = fieldValue;
            }
          }
        }
      }

      return document;
    }
  }

  private processSearchParameters(params: IDataObject): IDataObject {
    const processed: IDataObject = {};

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

  /**
   * Get the base URL for Typesense API
   */
  private getBaseUrl(credentials: TypesenseCredentials): string {
    const port = credentials.port ?? (credentials.protocol === 'https' ? 443 : 8108);
    return `${credentials.protocol}://${credentials.host}:${port}`;
  }

  private async importDocuments(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
    const documentsJsonl = this.validateRequired(context, 'documentsJsonl', itemIndex);
    const credentials = (await context.getCredentials('typesenseApi')) as TypesenseCredentials;

    // Build query parameters
    const importParameters = this.getObject(context, 'importParameters', itemIndex);
    const queryParams: Record<string, string> = {};

    if (importParameters.batchSize) {
      queryParams.batch_size = importParameters.batchSize.toString();
    }

    if (importParameters.returnId !== undefined) {
      queryParams.return_id = importParameters.returnId ? 'true' : 'false';
    }

    if (importParameters.returnDoc !== undefined) {
      queryParams.return_doc = importParameters.returnDoc ? 'true' : 'false';
    }

    if (importParameters.action) {
      queryParams.action = String(importParameters.action);
    }

    if (importParameters.dirtyValues) {
      queryParams.dirty_values = String(importParameters.dirtyValues);
    }

    if (importParameters.remoteEmbeddingBatchSize) {
      queryParams.remote_embedding_batch_size = importParameters.remoteEmbeddingBatchSize.toString();
    }

    const baseUrl = this.getBaseUrl(credentials);
    let url = `${baseUrl}/collections/${encodeURIComponent(collection)}/documents/import`;

    if (Object.keys(queryParams).length > 0) {
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        params.append(key, value);
      });
      url += `?${params.toString()}`;
    }

    // Make HTTP request with JSONL content
    const options: IDataObject = {
      method: 'POST',
      url,
      headers: {
        'X-TYPESENSE-API-KEY': credentials.apiKey,
        'Content-Type': 'application/octet-stream',
      },
      body: documentsJsonl,
      encoding: 'utf8',
    };

    const response = await context.helpers.request(options);

    // Parse JSONL response (each line is a JSON object)
    const lines = response.split('\n').filter((line: string) => line.trim());
    const results = lines.map((line: string) => {
      try {
        return jsonParse<IDataObject>(line);
      } catch {
        return { error: 'Failed to parse response line', raw: line };
      }
    });

    return {
      success: true,
      results,
      total: results.length,
    } as IDataObject;
  }

  private async exportDocuments(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
    const credentials = (await context.getCredentials('typesenseApi')) as TypesenseCredentials;

    // Build query parameters
    const exportParameters = this.getObject(context, 'exportParameters', itemIndex);
    const queryParams: Record<string, string> = {};

    if (exportParameters?.filterBy) {
      queryParams.filter_by = String(exportParameters.filterBy);
    }

    if (exportParameters?.includeFields) {
      queryParams.include_fields = String(exportParameters.includeFields);
    }

    if (exportParameters?.excludeFields) {
      queryParams.exclude_fields = String(exportParameters.excludeFields);
    }

    const baseUrl = this.getBaseUrl(credentials);
    let url = `${baseUrl}/collections/${encodeURIComponent(collection)}/documents/export`;

    if (Object.keys(queryParams).length > 0) {
      const params = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      url += `?${params.toString()}`;
    }

    // Make HTTP request to get JSONL export
    const options: IDataObject = {
      method: 'GET',
      url,
      headers: {
        'X-TYPESENSE-API-KEY': credentials.apiKey,
      },
      encoding: 'utf8',
    };

    const response = await context.helpers.request(options);

    // Parse JSONL response (each line is a JSON document)
    const lines = response.split('\n').filter((line: string) => line.trim());
    const documents = lines.map((line: string) => {
      try {
        return jsonParse<IDataObject>(line);
      } catch {
        return { error: 'Failed to parse document line', raw: line };
      }
    });

    return {
      success: true,
      documents,
      total: documents.length,
      jsonl: response,
    } as IDataObject;
  }
}
