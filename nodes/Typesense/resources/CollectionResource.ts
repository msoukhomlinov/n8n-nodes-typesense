import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { NodeApiError, NodeOperationError, jsonParse } from 'n8n-workflow';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import type { CollectionUpdateSchema } from 'typesense/lib/Typesense/Collection';

import { BaseTypesenseResource } from './BaseTypesenseResource';
import {
  buildCollectionCreateSchema,
  buildCollectionUpdateSchema,
  getTypesenseClient,
} from '../GenericFunctions';

export class CollectionResource extends BaseTypesenseResource {
  constructor() {
    super('collection');
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

  getFields(): INodeProperties[] {
    // UI fields for the Collection resource are defined in
    // nodes/Typesense/descriptions/CollectionDescription.ts.
    // Returning an empty array here avoids duplicating UI definitions in the resource class.
    return [];
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

  private async createCollection(
    context: IExecuteFunctions,
    client: any,
    itemIndex: number,
  ): Promise<IDataObject> {
    const useJson = this.getBoolean(context, 'jsonParameters', itemIndex);
    let schemaPayload: CollectionCreateSchema;

    if (useJson) {
      const schemaJson = this.validateRequired(context, 'schemaJson', itemIndex);
      schemaPayload = jsonParse<CollectionCreateSchema>(schemaJson);
      if (!schemaPayload.name || !Array.isArray(schemaPayload.fields)) {
        throw new NodeOperationError(
          context.getNode(),
          'Schema JSON must include both "name" and "fields" properties.',
          { itemIndex },
        );
      }
    } else {
      const schemaParameters = this.getObject(context, 'schemaParameters', itemIndex);
      const additionalFields = this.getObject(context, 'additionalFields', itemIndex);
      schemaPayload = buildCollectionCreateSchema.call(context, schemaParameters, additionalFields);
    }

    const response = await client.collections().create(schemaPayload);
    return response as IDataObject;
  }

  private async deleteCollection(
    context: IExecuteFunctions,
    client: any,
    itemIndex: number,
  ): Promise<IDataObject> {
    const collectionId = this.validateRequired(context, 'collectionId', itemIndex);
    const response = await client.collections(collectionId).delete();
    return response as IDataObject;
  }

  private async getCollection(
    context: IExecuteFunctions,
    client: any,
    itemIndex: number,
  ): Promise<IDataObject> {
    const collectionId = this.validateRequired(context, 'collectionId', itemIndex);
    const response = await client.collections(collectionId).retrieve();
    const result = response as IDataObject;
    const filterColumns = this.getOptional(context, 'filterColumns', itemIndex) as string | undefined;
    return this.filterColumns(result, filterColumns) as IDataObject;
  }

  private async getAllCollections(
    context: IExecuteFunctions,
    client: any,
    itemIndex: number,
  ): Promise<IDataObject[]> {
    const returnAll = this.getBoolean(context, 'returnAll', itemIndex, true);

    // Build query parameters for the API call
    const queryParams: any = {};

    const excludeFields = this.getOptional(context, 'excludeFields', itemIndex);
    if (excludeFields) {
      queryParams.exclude_fields = excludeFields;
    }

    if (!returnAll) {
      const limit = this.getNumber(context, 'limit', itemIndex, 50);
      queryParams.limit = limit;

      const offset = this.getNumber(context, 'offset', itemIndex, 0);
      if (offset > 0) {
        queryParams.offset = offset;
      }
    }

    // Call API with query parameters if any are specified
    let allCollections: IDataObject[];
    if (Object.keys(queryParams).length > 0) {
      allCollections = (await client.collections().retrieve(queryParams)) as unknown as IDataObject[];
    } else {
      allCollections = (await client.collections().retrieve()) as unknown as IDataObject[];
    }

    if (!Array.isArray(allCollections)) {
      throw new NodeOperationError(
        context.getNode(),
        'Unexpected response received from Typesense.',
        { itemIndex },
      );
    }

    const filterColumns = this.getOptional(context, 'filterColumns', itemIndex) as string | undefined;
    return this.filterColumns(allCollections, filterColumns) as IDataObject[];
  }

  private async updateCollection(
    context: IExecuteFunctions,
    client: any,
    itemIndex: number,
  ): Promise<IDataObject> {
    const collectionId = this.validateRequired(context, 'collectionId', itemIndex);
    const useJson = this.getBoolean(context, 'jsonParameters', itemIndex);
    let updatePayload: CollectionUpdateSchema;

    if (useJson) {
      const schemaJson = this.validateRequired(context, 'schemaJson', itemIndex);
      updatePayload = jsonParse<CollectionUpdateSchema>(schemaJson);
    } else {
      const schemaParameters = this.getObject(context, 'updateSchemaParameters', itemIndex);
      const additionalFields = this.getObject(context, 'updateAdditionalFields', itemIndex);
      updatePayload = buildCollectionUpdateSchema.call(context, schemaParameters, additionalFields);
    }

    if (Object.keys(updatePayload).length === 0) {
      throw new NodeOperationError(
        context.getNode(),
        'Please provide at least one field to update.',
        { itemIndex },
      );
    }

    const response = await client.collections(collectionId).update(updatePayload);
    return response as IDataObject;
  }
}
