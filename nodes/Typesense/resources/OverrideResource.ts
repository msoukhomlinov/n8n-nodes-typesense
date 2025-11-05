import type { IDataObject, IExecuteFunctions, INodeProperties, JsonObject } from 'n8n-workflow';
import { NodeApiError, NodeOperationError, jsonParse } from 'n8n-workflow';
import type Client from 'typesense/lib/Typesense/Client';

import { BaseTypesenseResource } from './BaseTypesenseResource';
import { getTypesenseClient } from '../GenericFunctions';

export class OverrideResource extends BaseTypesenseResource {
  constructor() {
    super('override');
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
            resource: ['override'],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            action: 'Create a search override',
            description: 'Create or update a search override',
          },
          {
            name: 'Delete',
            value: 'delete',
            action: 'Delete a search override',
            description: 'Delete a search override by ID',
          },
          {
            name: 'Get',
            value: 'get',
            action: 'Get a search override',
            description: 'Retrieve a search override by ID',
          },
          {
            name: 'Get Many',
            value: 'getAll',
            action: 'Get many search overrides',
            description: 'List all search overrides for a collection',
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
            resource: ['override'],
            operation: ['create', 'delete', 'get', 'getAll'],
          },
        },
        description: 'Name of the collection',
      },
      {
        displayName: 'Override ID',
        name: 'overrideId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['override'],
            operation: ['create', 'delete', 'get'],
          },
        },
        description: 'Unique identifier for the override',
      },
      {
        displayName: 'JSON Input',
        name: 'jsonInput',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: {
            resource: ['override'],
            operation: ['create'],
          },
        },
        description: 'Whether to provide the override as raw JSON',
      },
      {
        displayName: 'Override (JSON)',
        name: 'overrideJson',
        type: 'string',
        typeOptions: {
          rows: 15,
        },
        default: '',
        displayOptions: {
          show: {
            resource: ['override'],
            operation: ['create'],
            jsonInput: [true],
          },
        },
        description: 'Override configuration as JSON',
      },
      {
        displayName: 'Rule',
        name: 'rule',
        type: 'fixedCollection',
        default: {},
        required: true,
        displayOptions: {
          show: {
            resource: ['override'],
            operation: ['create'],
            jsonInput: [false],
          },
        },
        description: 'Rule that triggers the override',
        options: [
          {
            name: 'ruleValues',
            displayName: 'Rule',
            values: [
              {
                displayName: 'Query',
                name: 'query',
                type: 'string',
                default: '',
                required: true,
                description: 'Search query that should trigger this override',
              },
              {
                displayName: 'Match Type',
                name: 'match',
                type: 'options',
                options: [
                  { name: 'Exact', value: 'exact' },
                  { name: 'Contains', value: 'contains' },
                ],
                default: 'exact',
                description: 'Whether to match the query exactly or if it contains the term',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Includes',
        name: 'includes',
        type: 'fixedCollection',
        default: [],
        typeOptions: {
          multipleValues: true,
        },
        displayOptions: {
          show: {
            resource: ['override'],
            operation: ['create'],
            jsonInput: [false],
          },
        },
        description: 'Documents to include in search results',
        options: [
          {
            name: 'include',
            displayName: 'Include',
            values: [
              {
                displayName: 'Document ID',
                name: 'id',
                type: 'string',
                default: '',
                required: true,
                description: 'ID of the document to include',
              },
              {
                displayName: 'Position',
                name: 'position',
                type: 'number',
                default: 1,
                required: true,
                description: 'Position where the document should appear',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Excludes',
        name: 'excludes',
        type: 'fixedCollection',
        default: [],
        typeOptions: {
          multipleValues: true,
        },
        displayOptions: {
          show: {
            resource: ['override'],
            operation: ['create'],
            jsonInput: [false],
          },
        },
        description: 'Documents to exclude from search results',
        options: [
          {
            name: 'exclude',
            displayName: 'Exclude',
            values: [
              {
                displayName: 'Document ID',
                name: 'id',
                type: 'string',
                default: '',
                required: true,
                description: 'ID of the document to exclude',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Additional Options',
        name: 'additionalOptions',
        type: 'collection',
        default: {},
        displayOptions: {
          show: {
            resource: ['override'],
            operation: ['create'],
            jsonInput: [false],
          },
        },
        options: [
          {
            displayName: 'Filter By',
            name: 'filter_by',
            type: 'string',
            default: '',
            description: 'Filter clause applied to matching queries',
          },
          {
            displayName: 'Sort By',
            name: 'sort_by',
            type: 'string',
            default: '',
            description: 'Sort clause applied to matching queries',
          },
          {
            displayName: 'Replace Query',
            name: 'replace_query',
            type: 'string',
            default: '',
            description: 'Replace the search query with this value',
          },
          {
            displayName: 'Remove Matched Tokens',
            name: 'remove_matched_tokens',
            type: 'boolean',
            default: false,
            description: 'Whether to remove matched tokens from the query',
          },
          {
            displayName: 'Filter Curated Hits',
            name: 'filter_curated_hits',
            type: 'boolean',
            default: false,
            description: 'Whether to apply filter conditions to curated records',
          },
          {
            displayName: 'Metadata (JSON)',
            name: 'metadata',
            type: 'string',
            default: '',
            description: 'Custom JSON metadata to return when this rule is triggered',
          },
          {
            displayName: 'Effective From (Unix Timestamp)',
            name: 'effective_from_ts',
            type: 'number',
            default: 0,
            description: 'Unix timestamp when the override becomes active',
          },
          {
            displayName: 'Effective To (Unix Timestamp)',
            name: 'effective_to_ts',
            type: 'number',
            default: 0,
            description: 'Unix timestamp when the override expires',
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
            resource: ['override'],
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
            resource: ['override'],
            operation: ['getAll'],
            returnAll: [false],
          },
        },
        description: 'Maximum number of overrides to retrieve',
      },
      {
        displayName: 'Filter Columns',
        name: 'filterColumns',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['override'],
            operation: ['get', 'getAll'],
          },
        },
        description: 'Comma-separated list of column names to include in the output. Leave empty to return all columns.',
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
          return await this.createOverride(context, client, itemIndex);

        case 'delete':
          return await this.deleteOverride(context, client, itemIndex);

        case 'get':
          return await this.getOverride(context, client, itemIndex);

        case 'getAll':
          return await this.getAllOverrides(context, client, itemIndex);

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

  private async createOverride(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
    const overrideId = this.validateRequired(context, 'overrideId', itemIndex);
    const useJson = this.getBoolean(context, 'jsonInput', itemIndex);

    let overrideData: IDataObject;

    if (useJson) {
      const overrideJson = this.validateRequired(context, 'overrideJson', itemIndex);
      try {
        overrideData = jsonParse<IDataObject>(overrideJson);
      } catch {
        throw new NodeOperationError(context.getNode(), 'Override JSON must be valid JSON.', {
          itemIndex,
        });
      }
    } else {
      const rule = this.getObject(context, 'rule', itemIndex);
      const ruleValues = (rule as IDataObject).ruleValues as IDataObject;

      if (!ruleValues || !ruleValues.query) {
        throw new NodeOperationError(context.getNode(), 'Rule query is required.', { itemIndex });
      }

      overrideData = {
        rule: {
          query: ruleValues.query,
          match: ruleValues.match || 'exact',
        },
      };

      // Handle includes
      const includes = this.getArray(context, 'includes', itemIndex, []) as unknown as IDataObject[];
      if (includes.length > 0) {
        overrideData.includes = includes.map((inc: IDataObject) => ({
          id: inc.id,
          position: inc.position,
        }));
      }

      // Handle excludes
      const excludes = this.getArray(context, 'excludes', itemIndex, []) as unknown as IDataObject[];
      if (excludes.length > 0) {
        overrideData.excludes = excludes.map((exc: IDataObject) => ({
          id: exc.id,
        }));
      }

      // Handle additional options
      const additionalOptions = this.getObject(context, 'additionalOptions', itemIndex);
      if (additionalOptions) {
        if (additionalOptions.filter_by) {
          overrideData.filter_by = additionalOptions.filter_by;
        }
        if (additionalOptions.sort_by) {
          overrideData.sort_by = additionalOptions.sort_by;
        }
        if (additionalOptions.replace_query) {
          overrideData.replace_query = additionalOptions.replace_query;
        }
        if (additionalOptions.remove_matched_tokens !== undefined) {
          overrideData.remove_matched_tokens = additionalOptions.remove_matched_tokens;
        }
        if (additionalOptions.filter_curated_hits !== undefined) {
          overrideData.filter_curated_hits = additionalOptions.filter_curated_hits;
        }
        if (additionalOptions.metadata) {
          try {
            overrideData.metadata = jsonParse<IDataObject>(additionalOptions.metadata as string);
          } catch {
            throw new NodeOperationError(context.getNode(), 'Metadata must be valid JSON.', {
              itemIndex,
            });
          }
        }
        if (additionalOptions.effective_from_ts) {
          overrideData.effective_from_ts = additionalOptions.effective_from_ts;
        }
        if (additionalOptions.effective_to_ts) {
          overrideData.effective_to_ts = additionalOptions.effective_to_ts;
        }
      }
    }

    const response = await client
      .collections(collection)
      .overrides()
      .upsert(overrideId, overrideData as unknown as any);
    return response as unknown as IDataObject;
  }

  private async deleteOverride(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
    const overrideId = this.validateRequired(context, 'overrideId', itemIndex);

    const response = await client.collections(collection).overrides(overrideId).delete();
    return response as unknown as IDataObject;
  }

  private async getOverride(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
    const overrideId = this.validateRequired(context, 'overrideId', itemIndex);

    const response = await client.collections(collection).overrides(overrideId).retrieve();
    const result = response as unknown as IDataObject;
    const filterColumns = this.getOptional(context, 'filterColumns', itemIndex) as string | undefined;
    return this.filterColumns(result, filterColumns) as IDataObject;
  }

  private async getAllOverrides(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject[]> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
    const returnAll = this.getBoolean(context, 'returnAll', itemIndex, true);
    const limit = this.getNumber(context, 'limit', itemIndex, 50);

    const response = await client.collections(collection).overrides().retrieve();

    // API returns { overrides: [...] }
    const overrides = (response as unknown as IDataObject).overrides as IDataObject[] || [];

    let result: IDataObject[];
    if (returnAll) {
      result = overrides;
    } else {
      result = overrides.slice(0, limit);
    }

    const filterColumns = this.getOptional(context, 'filterColumns', itemIndex) as string | undefined;
    return this.filterColumns(result, filterColumns) as IDataObject[];
  }
}

