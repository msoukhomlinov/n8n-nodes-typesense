import type { IDataObject, IExecuteFunctions, INodeProperties, JsonObject } from 'n8n-workflow';
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
    // Fields for this resource are defined in nodes/Typesense/descriptions/SynonymDescription.ts
    // Return an empty array here to avoid duplicating or conflicting definitions.
    return [];
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
      throw new NodeApiError(context.getNode(), error as JsonObject, { itemIndex });
    }
  }

  private async createSynonymSet(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
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
    } else {
      const synonymsString = this.validateRequired(context, 'synonyms', itemIndex);
      const synonymsArray = synonymsString
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);

      if (synonymsArray.length === 0) {
        throw new NodeOperationError(
          context.getNode(),
          'Synonyms must have at least one non-empty value.',
          { itemIndex },
        );
      }

      synonymSetData = {
        synonyms: synonymsArray,
      };

      const additionalOptions = this.getObject(context, 'additionalOptions', itemIndex);
      if (additionalOptions) {
        if (additionalOptions.root) {
          synonymSetData.root = additionalOptions.root as string;
        }
        if (additionalOptions.locale) {
          synonymSetData.locale = additionalOptions.locale as string;
        }
        if (additionalOptions.symbols_to_index) {
          const symbolsArray = (additionalOptions.symbols_to_index as string)
            .split(',')
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0);
          if (symbolsArray.length > 0) {
            synonymSetData.symbols_to_index = symbolsArray;
          }
        }
      }
    }

    const response = await client
      .collections(collection)
      .synonyms()
      .upsert(synonymSetName, synonymSetData as IDataObject & { synonyms: string[] });
    return response as unknown as IDataObject;
  }

  private async deleteSynonymSet(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
    const synonymSetName = this.validateRequired(context, 'synonymSetName', itemIndex);
    const response = await client.collections(collection).synonyms(synonymSetName).delete();
    return response as unknown as IDataObject;
  }

  private async getSynonymSet(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
    const synonymSetName = this.validateRequired(context, 'synonymSetName', itemIndex);
    const response = await client.collections(collection).synonyms(synonymSetName).retrieve();
    const result = response as unknown as IDataObject;
    const filterColumns = this.getOptional(context, 'filterColumns', itemIndex, '') as string;
    return this.filterColumns(result, filterColumns) as IDataObject;
  }

  private async getAllSynonymSets(
    context: IExecuteFunctions,
    client: Client,
    itemIndex: number,
  ): Promise<IDataObject[]> {
    const collection = this.validateRequired(context, 'collection', itemIndex);
    const returnAll = this.getBoolean(context, 'returnAll', itemIndex, true);
    const limit = this.getNumber(context, 'limit', itemIndex, 50);

    const response = await client.collections(collection).synonyms().retrieve();

    // API returns { synonyms: [...] }
    const synonymSets = (response as unknown as IDataObject).synonyms as IDataObject[] || [];

    let result: IDataObject[];
    if (returnAll) {
      result = synonymSets;
    } else {
      result = synonymSets.slice(0, limit);
    }

    const filterColumns = this.getOptional(context, 'filterColumns', itemIndex, '') as string;
    return this.filterColumns(result, filterColumns) as IDataObject[];
  }
}
