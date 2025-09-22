import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  JsonObject,
  NodeConnectionType,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError, jsonParse } from 'n8n-workflow';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import type { CollectionUpdateSchema } from 'typesense/lib/Typesense/Collection';

import { collectionFields, collectionOperations } from './descriptions/CollectionDescription';
import {
  buildCollectionCreateSchema,
  buildCollectionUpdateSchema,
  getTypesenseClient,
} from './GenericFunctions';

export class Typesense implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Typesense',
    name: 'typesense',
    icon: 'file:typesense.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}} {{ $parameter["resource"] }}',
    description: 'Interact with the Typesense search platform',
    defaults: {
      name: 'Typesense',
    },
    inputs: ['main'] as Array<NodeConnectionType>,
    outputs: ['main'] as Array<NodeConnectionType>,
    credentials: [
      {
        name: 'typesenseApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Collection',
            value: 'collection',
          },
        ],
        default: 'collection',
      },
      ...collectionOperations,
      ...collectionFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: IDataObject[] = [];
    const client = await getTypesenseClient.call(this);

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const resource = this.getNodeParameter('resource', itemIndex) as string;
      const operation = this.getNodeParameter('operation', itemIndex) as string;

      try {
        if (resource !== 'collection') {
          throw new NodeOperationError(
            this.getNode(),
            `The resource "${resource}" is not supported.`,
          );
        }

        if (operation === 'create') {
          const useJson = this.getNodeParameter('jsonParameters', itemIndex) as boolean;
          let schemaPayload: CollectionCreateSchema;

          if (useJson) {
            const schemaJson = this.getNodeParameter('schemaJson', itemIndex) as string;
            if (!schemaJson) {
              throw new NodeOperationError(this.getNode(), 'Schema JSON must be provided.', {
                itemIndex,
              });
            }
            schemaPayload = jsonParse<CollectionCreateSchema>(schemaJson);
            if (!schemaPayload.name || !Array.isArray(schemaPayload.fields)) {
              throw new NodeOperationError(
                this.getNode(),
                'Schema JSON must include both "name" and "fields" properties.',
                { itemIndex },
              );
            }
          } else {
            const schemaParameters = this.getNodeParameter(
              'schemaParameters',
              itemIndex,
            ) as IDataObject;
            const additionalFields = this.getNodeParameter(
              'additionalFields',
              itemIndex,
              {},
            ) as IDataObject;
            schemaPayload = buildCollectionCreateSchema.call(
              this,
              schemaParameters,
              additionalFields,
            );
          }

          const response = await client.collections().create(schemaPayload);
          returnData.push(response as unknown as IDataObject);
          continue;
        }

        if (operation === 'delete') {
          const collectionId = this.getNodeParameter('collectionId', itemIndex) as string;
          const response = await client.collections(collectionId).delete();
          returnData.push(response as unknown as IDataObject);
          continue;
        }

        if (operation === 'get') {
          const collectionId = this.getNodeParameter('collectionId', itemIndex) as string;
          const response = await client.collections(collectionId).retrieve();
          returnData.push(response as unknown as IDataObject);
          continue;
        }

        if (operation === 'getAll') {
          const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
          const allCollections = (await client
            .collections()
            .retrieve()) as unknown as IDataObject[];

          if (!Array.isArray(allCollections)) {
            throw new NodeOperationError(
              this.getNode(),
              'Unexpected response received from Typesense.',
            );
          }

          if (returnAll) {
            returnData.push(...allCollections);
            continue;
          }

          const limit = this.getNodeParameter('limit', itemIndex) as number;
          returnData.push(...allCollections.slice(0, limit));
          continue;
        }

        if (operation === 'update') {
          const collectionId = this.getNodeParameter('collectionId', itemIndex) as string;
          const useJson = this.getNodeParameter('jsonParameters', itemIndex) as boolean;
          let updatePayload: CollectionUpdateSchema;

          if (useJson) {
            const schemaJson = this.getNodeParameter('schemaJson', itemIndex) as string;
            if (!schemaJson) {
              throw new NodeOperationError(this.getNode(), 'Schema JSON must be provided.', {
                itemIndex,
              });
            }
            updatePayload = jsonParse<CollectionUpdateSchema>(schemaJson);
          } else {
            const schemaParameters = this.getNodeParameter(
              'updateSchemaParameters',
              itemIndex,
              {},
            ) as IDataObject;
            const additionalFields = this.getNodeParameter(
              'updateAdditionalFields',
              itemIndex,
              {},
            ) as IDataObject;
            updatePayload = buildCollectionUpdateSchema.call(
              this,
              schemaParameters,
              additionalFields,
            );
          }

          if (Object.keys(updatePayload).length === 0) {
            throw new NodeOperationError(
              this.getNode(),
              'Please provide at least one field to update.',
              {
                itemIndex,
              },
            );
          }

          const response = await client.collections(collectionId).update(updatePayload);
          returnData.push(response as unknown as IDataObject);
          continue;
        }

        throw new NodeOperationError(
          this.getNode(),
          `The operation "${operation}" is not supported.`,
        );
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ error: (error as Error).message });
          continue;
        }

        throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex });
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }
}
