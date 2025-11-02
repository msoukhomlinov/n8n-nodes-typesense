import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { NodeApiError, NodeOperationError, jsonParse } from 'n8n-workflow';
import type Client from 'typesense/lib/Typesense/Client';

import { BaseTypesenseResource } from './BaseTypesenseResource';
import { getTypesenseClient } from '../GenericFunctions';

export class SynonymResource extends BaseTypesenseResource {
  constructor() {
    super('synonym');
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
            resource: ['synonym'],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            action: 'Create a synonym set',
            description: 'Create or update a synonym set',
          },
          {
            name: 'Delete',
            value: 'delete',
            action: 'Delete a synonym set',
            description: 'Delete a synonym set by name',
          },
          {
            name: 'Get',
            value: 'get',
            action: 'Get a synonym set',
            description: 'Retrieve a synonym set by name',
          },
          {
            name: 'Get Many',
            value: 'getAll',
            action: 'Get many synonym sets',
            description: 'List all synonym sets',
          },
        ],
        default: 'create',
      },
    ];
  }

  getFields(): INodeProperties[] {
    return [
      {
        displayName: 'Synonym Set Name',
        name: 'synonymSetName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['synonym'],
            operation: ['create', 'delete', 'get'],
          },
        },
        description: 'Name of the synonym set to operate on',
      },
      {
        displayName: 'JSON Input',
        name: 'jsonInput',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: {
            resource: ['synonym'],
            operation: ['create'],
          },
        },
        description: 'Whether to provide the synonym set as raw JSON',
      },
      {
        displayName: 'Synonym Set (JSON)',
        name: 'synonymSetJson',
        type: 'string',
        typeOptions: {
          rows: 10,
        },
        default: '',
        displayOptions: {
          show: {
            resource: ['synonym'],
            operation: ['create'],
            jsonInput: [true],
          },
        },
        description:
          'Synonym set as JSON. Must include "items" array with objects containing "id" and "synonyms" fields.',
      },
      {
        displayName: 'Synonym Items',
        name: 'synonymItems',
        type: 'fixedCollection',
        default: [],
        typeOptions: {
          multipleValues: true,
        },
        displayOptions: {
          show: {
            resource: ['synonym'],
            operation: ['create'],
            jsonInput: [false],
          },
        },
        description: 'Array of synonym items',
        options: [
          {
            name: 'item',
            displayName: 'Item',
            values: [
              {
                displayName: 'ID',
                name: 'id',
                type: 'string',
                default: '',
                required: true,
                description: 'Unique identifier for the synonym item',
              },
              {
                displayName: 'Synonyms',
                name: 'synonyms',
                type: 'string',
                default: '',
                required: true,
                description: 'Comma-separated list of words that should be considered as synonyms',
              },
              {
                displayName: 'Root',
                name: 'root',
                type: 'string',
                default: '',
                description: 'For 1-way synonyms, the root word that synonyms map to',
              },
              {
                displayName: 'Locale',
                name: 'locale',
                type: 'string',
                default: '',
                description: 'Locale for the synonym (leave blank for standard tokenizer)',
              },
            ],
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
            resource: ['synonym'],
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
            resource: ['synonym'],
            operation: ['getAll'],
            returnAll: [false],
          },
        },
        description: 'Maximum number of synonym sets to retrieve',
      },
    ];
  }

  async execute(
    operation: string,
    context: IExecuteFunctions,
    itemIndex: number,
  ): Promise<IDataObject | IDataObject[]> {
    const client = (await getTypesenseClient.call(context)) as Client;

    try {
      switch (operation) {
        case 'create':
          return await this.createSynonymSet(context, client, itemIndex);

        case 'delete':
          return await this.deleteSynonymSet(context, client, itemIndex);

        case 'get':
          return await this.getSynonymSet(context, client, itemIndex);

        case 'getAll':
          return await this.getAllSynonymSets(context, client, itemIndex);

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

  private async createSynonymSet(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject> {
    const synonymSetName = this.validateRequired(context, 'synonymSetName', itemIndex);
    const useJson = this.getBoolean(context, 'jsonInput', itemIndex);

    let synonymSetData: IDataObject;

    if (useJson) {
      const synonymSetJson = this.validateRequired(context, 'synonymSetJson', itemIndex);
      try {
        synonymSetData = jsonParse<IDataObject>(synonymSetJson);
      } catch {
        throw new NodeOperationError(context.getNode(), 'Synonym set JSON must be valid JSON.', {
          itemIndex,
        });
      }

      if (!Array.isArray(synonymSetData.items)) {
        throw new NodeOperationError(
          context.getNode(),
          'Synonym set JSON must include an "items" array.',
          { itemIndex },
        );
      }
    } else {
      const synonymItems = this.getArray(context, 'synonymItems', itemIndex, []) as unknown as IDataObject[];
      if (synonymItems.length === 0) {
        throw new NodeOperationError(
          context.getNode(),
          'Please provide at least one synonym item.',
          { itemIndex },
        );
      }

      synonymSetData = {
        items: synonymItems.map((item: IDataObject) => {
          const synonymsArray = (item.synonyms as string)
            .split(',')
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0);

          if (synonymsArray.length === 0) {
            throw new NodeOperationError(
              context.getNode(),
              'Each synonym item must have at least one non-empty synonym.',
              { itemIndex },
            );
          }

          const itemData: IDataObject = {
            id: item.id as string,
            synonyms: synonymsArray,
          };

          if (item.root) {
            itemData.root = item.root as string;
          }

          if (item.locale) {
            itemData.locale = item.locale as string;
          }

          return itemData;
        }),
      };
    }

    const response = await (client as unknown as any).synonyms(synonymSetName).upsert(synonymSetData);
    return response as IDataObject;
  }

  private async deleteSynonymSet(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject> {
    const synonymSetName = this.validateRequired(context, 'synonymSetName', itemIndex);
    const response = await (client as unknown as any).synonyms(synonymSetName).delete();
    return response as IDataObject;
  }

  private async getSynonymSet(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject> {
    const synonymSetName = this.validateRequired(context, 'synonymSetName', itemIndex);
    const response = await (client as unknown as any).synonyms(synonymSetName).retrieve();
    return response as IDataObject;
  }

  private async getAllSynonymSets(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject[]> {
    const returnAll = this.getBoolean(context, 'returnAll', itemIndex, true);
    const limit = this.getNumber(context, 'limit', itemIndex, 50);

    const response = await (client as unknown as any).synonyms().retrieve();

    // API returns { synonym_sets: [...] }
    const synonymSets = (response as IDataObject).synonym_sets as IDataObject[] || [];

    if (returnAll) {
      return synonymSets;
    }

    return synonymSets.slice(0, limit);
  }
}
