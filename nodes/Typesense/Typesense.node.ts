import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  INodePropertyOptions,
  ILoadOptionsFunctions,
  JsonObject,
  NodeConnectionType,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import { TypesenseResourceFactory } from './TypesenseResourceFactory';
import { collectionOperations, collectionFields } from './descriptions/CollectionDescription';
import { documentOperations, documentFields } from './descriptions/DocumentDescription';
import { searchOperations, searchFields } from './descriptions/SearchDescription';
import { analyticsOperations, analyticsFields } from './descriptions/AnalyticsDescription';
import { apiKeyOperations, apiKeyFields } from './descriptions/APIKeyDescription';
import { aliasOperations, aliasFields } from './descriptions/AliasDescription';
import { synonymOperations, synonymFields } from './descriptions/SynonymDescription';
import { overrideOperations, overrideFields } from './descriptions/OverrideDescription';
import { conversationOperations, conversationFields } from './descriptions/ConversationDescription';
import { getTypesenseClient } from './GenericFunctions';

export class Typesense implements INodeType {
  methods = {
    loadOptions: {
      async getCollections(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        try {
          const client = await getTypesenseClient.call(this);
          const collections = await client.collections().retrieve();
          const options: INodePropertyOptions[] = (collections as Array<{ name: string }>).map(
            (c) => ({ name: c.name, value: c.name }),
          );
          options.sort((a, b) => String(a.name).localeCompare(String(b.name)));
          return options;
        } catch (error) {
          return [
            {
              name: `Error loading collections: ${(error as Error).message}`,
              value: '',
            },
          ];
        }
      },

      async getFieldNames(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        try {
          // Support both 'collection' and 'collectionId' parameters
          let collectionName = this.getCurrentNodeParameter('collection') as string;
          if (!collectionName) {
            collectionName = this.getCurrentNodeParameter('collectionId') as string;
          }
          
          if (!collectionName) {
            return [{ name: 'Please select a collection first', value: '' }];
          }

          const client = await getTypesenseClient.call(this);
          const collection = await client.collections(collectionName).retrieve();
          
          if (!collection.fields || collection.fields.length === 0) {
            return [{ name: 'No fields found in collection', value: '' }];
          }

          const options: INodePropertyOptions[] = collection.fields.map((field: any) => ({
            name: `${field.name} (${field.type})`,
            value: field.name,
          }));
          
          options.sort((a, b) => String(a.name).localeCompare(String(b.name)));
          return options;
        } catch (error) {
          return [
            {
              name: `Error loading fields: ${(error as Error).message}`,
              value: '',
            },
          ];
        }
      },

      async getSynonymSets(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        try {
          const collectionName = this.getCurrentNodeParameter('collection') as string;
          if (!collectionName) {
            return [{ name: 'Please select a collection first', value: '' }];
          }

          const client = await getTypesenseClient.call(this);
          const response = await client.collections(collectionName).synonyms().retrieve();
          
          // Typesense returns { synonyms: [...] }
          const synonymSets = (response as any).synonyms || [];
          
          if (synonymSets.length === 0) {
            return [{ name: 'No synonym sets found', value: '' }];
          }

          const options: INodePropertyOptions[] = synonymSets.map((set: any) => ({
            name: set.id,
            value: set.id,
          }));
          
          options.sort((a, b) => String(a.name).localeCompare(String(b.name)));
          return options;
        } catch (error) {
          return [
            {
              name: `Error loading synonym sets: ${(error as Error).message}`,
              value: '',
            },
          ];
        }
      },
    },
  };
  description: INodeTypeDescription = {
    displayName: 'Typesense',
    name: 'typesense',
    icon: 'file:typesense.svg',
    usableAsTool: true,
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
        options: TypesenseResourceFactory.getResourceDisplayNames(),
        default: 'collection',
      },
      // Collection operations and fields
      ...collectionOperations,
      ...collectionFields,
      // Document operations and fields
      ...documentOperations,
      ...documentFields,
      // Search operations and fields
      ...searchOperations,
      ...searchFields,
      // Analytics operations and fields
      ...analyticsOperations,
      ...analyticsFields,
      // API Key operations and fields
      ...apiKeyOperations,
      ...apiKeyFields,
      // Alias operations and fields
      ...aliasOperations,
      ...aliasFields,
      // Synonym operations and fields
      ...synonymOperations,
      ...synonymFields,
      // Override operations and fields
      ...overrideOperations,
      ...overrideFields,
      // Conversation operations and fields
      ...conversationOperations,
      ...conversationFields,
    ],
  };


  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: IDataObject[] = [];

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const resourceType = this.getNodeParameter('resource', itemIndex) as string;
      const operation = this.getNodeParameter('operation', itemIndex) as string;

      try {
        // Validate resource type
        if (!TypesenseResourceFactory.isResourceSupported(resourceType)) {
          throw new NodeOperationError(
            this.getNode(),
            `The resource "${resourceType}" is not supported. Supported resources: ${TypesenseResourceFactory.getSupportedResources().join(', ')}`,
            { itemIndex },
          );
        }

        // Get the appropriate resource implementation
        const resource = TypesenseResourceFactory.getResource(resourceType);

        // Execute the operation using the resource implementation
        const result = await resource.execute(operation, this, itemIndex);

        // Handle both single objects and arrays
        if (Array.isArray(result)) {
          returnData.push(...result);
        } else {
          returnData.push(result);
        }
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
